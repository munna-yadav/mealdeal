"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useVerifyEmail } from "@/hooks/useAuth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react"

export default function VerifyPage() {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get("token")
  const verifyEmailMutation = useVerifyEmail()

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification link")
        return
      }

      try {
        await verifyEmailMutation.mutateAsync(token)
        setIsVerified(true)
        
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin")
        }, 3000)
        
      } catch (error: unknown) {
        const message = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || 
                       (error as { message?: string })?.message || "Verification failed"
        setError(message)
      }
    }

    verifyEmail()
  }, [token, router, verifyEmailMutation])

  const isLoading = verifyEmailMutation.isPending
  const displayError = error || (verifyEmailMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold">
            Email{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Verification
            </span>
          </h2>
        </div>

        {/* Verification Status */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isLoading ? (
                <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
              ) : isVerified ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            
            <CardTitle>
              {isLoading 
                ? "Verifying your email..." 
                : isVerified 
                  ? "Email Verified Successfully!" 
                  : "Verification Failed"
              }
            </CardTitle>
            
            <CardDescription>
              {isLoading && (
                "Please wait while we verify your email address."
              )}
              {isVerified && (
                "Your email has been verified successfully. You can now sign in to your account."
              )}
              {error && !isLoading && (
                "There was an issue verifying your email address."
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {displayError && !isLoading && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            {isVerified && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Success!</strong> Your account is now active. 
                  You&apos;ll be redirected to the sign in page in a few seconds.
                </AlertDescription>
              </Alert>
            )}

            {error && !isLoading && (
              <Alert>
                <AlertDescription>
                  <strong>Common issues:</strong>
                  <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                    <li>The verification link may have expired</li>
                    <li>The link may have already been used</li>
                    <li>The link may be invalid or corrupted</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            {isVerified ? (
              <div className="flex flex-col w-full gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth/signin">
                    Continue to Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    Return to Home
                  </Link>
                </Button>
              </div>
            ) : displayError && !isLoading ? (
              <div className="flex flex-col w-full gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth/signup">
                    Create New Account
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/signin">
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            ) : null}
          </CardFooter>
        </Card>

        {/* Help Card */}
        {displayError && !isLoading && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3">
                If you continue to have issues with email verification:
              </p>
              <div className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/auth/resend-verification">
                    Resend Verification Email
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
