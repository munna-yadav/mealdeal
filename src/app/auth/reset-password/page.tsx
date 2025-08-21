"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenError, setTokenError] = useState("")
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get("token")

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid or missing reset token")
    }
  }, [token])

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      return "Password must contain at least one letter"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call - you'll need to implement this endpoint
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to reset password")
      }

      setIsSuccess(true)
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            
            <h2 className="text-3xl font-bold">Invalid Reset Link</h2>
            <p className="mt-4 text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Common issues:</strong>
                    <br />
                    • The link may have expired (links are valid for 1 hour)
                    <br />
                    • The link may have already been used
                    <br />
                    • The link may be corrupted or incomplete
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/auth/forgot-password">
                      Request New Reset Link
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/auth/signin">
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold">Password Reset Successful!</h2>
            <p className="mt-4 text-muted-foreground">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Success!</strong> Your password has been updated. 
                    You'll be redirected to the sign in page in a few seconds.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/auth/signin">
                      Continue to Sign In
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">
                      Return to Home
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold">
            Set New{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Password
            </span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create a strong password for your MealDeal account
          </p>
        </div>

        {/* Reset Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>
              Choose a strong password that you haven't used before
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters with at least one letter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Password strength:</div>
                  <div className="flex gap-1">
                    <div className={`h-1 w-full rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 w-full rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 w-full rounded ${/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 w-full rounded ${/(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline transition-colors"
                >
                  Sign in instead
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

