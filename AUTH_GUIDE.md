# MealDeal Authentication System

A robust authentication system built with React Query (TanStack Query), Axios, and Next.js App Router.

## 🏗️ Architecture

### Core Technologies
- **React Query** - Data fetching, caching, and state management
- **Axios** - HTTP client with interceptors
- **JWT** - Secure token-based authentication
- **Prisma** - Database ORM
- **Next.js Middleware** - Route protection

## 📁 File Structure

```
src/
├── hooks/
│   ├── useAuth.ts          # Main auth hooks
│   └── useAuthGuard.ts     # Route protection hooks
├── lib/
│   └── api.ts              # Axios client and API functions
├── providers/
│   └── query-provider.tsx  # React Query provider
├── app/
│   ├── api/auth/           # Auth API routes
│   │   ├── signin/         # Sign in endpoint
│   │   ├── signup/         # Sign up endpoint
│   │   ├── logout/         # Logout endpoint
│   │   ├── verify/         # Email verification
│   │   └── me/             # Get current user
│   └── auth/               # Auth pages
│       ├── signin/         # Sign in page
│       ├── signup/         # Sign up page
│       └── verify/         # Email verification page
└── middleware.ts           # Route protection middleware
```

## 🔐 Authentication Flow

### 1. Sign Up
```typescript
import { useSignup } from '@/hooks/useAuth'

const signupMutation = useSignup()

// Sign up user
await signupMutation.mutateAsync({
  name: "John Doe",
  email: "john@example.com", 
  password: "password123"
})
```

### 2. Email Verification
```typescript
import { useVerifyEmail } from '@/hooks/useAuth'

const verifyMutation = useVerifyEmail()

// Verify email with token
await verifyMutation.mutateAsync(token)
```

### 3. Sign In
```typescript
import { useAuth } from '@/hooks/useAuth'

const { signin, isSigningIn } = useAuth()

// Sign in user
await signin({
  email: "john@example.com",
  password: "password123"
})
```

### 4. Access User Data
```typescript
import { useAuth } from '@/hooks/useAuth'

function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>
  
  return <div>Welcome, {user.name}!</div>
}
```

## 🛡️ Route Protection

### Using Middleware (Automatic)
Routes are automatically protected based on configuration in `middleware.ts`:

```typescript
// Protected routes - require authentication
const protectedPaths = ['/profile']

// Auth routes - redirect if already signed in  
const authPaths = ['/auth/signin', '/auth/signup']
```

### Using Hooks (Manual)
```typescript
import { useAuthGuard } from '@/hooks/useAuthGuard'

function ProtectedPage() {
  const { isAuthorized, isLoading } = useAuthGuard()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthorized) return null // Will redirect
  
  return <div>Protected content</div>
}
```

### Guest-only Pages
```typescript
import { useGuestGuard } from '@/hooks/useAuthGuard'

function SignInPage() {
  const { canAccess } = useGuestGuard()
  
  if (!canAccess) return null // Will redirect if authenticated
  
  return <SignInForm />
}
```

## 🎯 Available Hooks

### `useAuth()` - Main Auth Hook
```typescript
const {
  // User data
  user,                    // User object or null
  isLoading,              // Loading state
  isAuthenticated,        // Boolean auth state
  
  // Actions
  signin,                 // Sign in function
  logout,                 // Logout function
  refetch,               // Refetch user data
  
  // Mutation states
  isSigningIn,           // Sign in loading state
  isLoggingOut,          // Logout loading state
  signinError,           // Sign in error
  logoutError,           // Logout error
} = useAuth()
```

### `useUser()` - Get Current User
```typescript
const { data: user, isLoading, error } = useUser()
```

### `useSignup()` - Sign Up Hook
```typescript
const signupMutation = useSignup()
await signupMutation.mutateAsync(userData)
```

### `useVerifyEmail()` - Email Verification
```typescript
const verifyMutation = useVerifyEmail()
await verifyMutation.mutateAsync(token)
```

### `useAuthGuard()` - Route Protection
```typescript
const { isAuthorized, isLoading } = useAuthGuard('/auth/signin')
```

### `useGuestGuard()` - Guest-only Routes
```typescript
const { canAccess } = useGuestGuard('/')
```

### `useAuthState()` - Conditional Rendering
```typescript
const { when } = useAuthState()

return (
  <div>
    {when.authenticated(<UserMenu />)}
    {when.guest(<SignInButton />)}
    {when.loading(<Spinner />)}
  </div>
)
```

## 🔧 Configuration

### API Client Setup
The Axios client is configured in `src/lib/api.ts` with:
- Automatic cookie handling
- Request/response interceptors
- Error handling
- Base URL configuration

### React Query Setup  
The Query Client is configured in `src/providers/query-provider.tsx` with:
- Stale time optimization
- Retry logic
- Development tools
- Cache management

### Environment Variables
```bash
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
DATABASE_URL=your-database-url
```

## 📱 Usage Examples

### In Components
```typescript
// Navbar component
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  
  return (
    <nav>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Link href="/auth/signin">Sign In</Link>
      )}
    </nav>
  )
}
```

### In Pages
```typescript
// Protected profile page
function ProfilePage() {
  const { isAuthorized } = useAuthGuard()
  const { user } = useAuth()
  
  if (!isAuthorized) return null
  
  return (
    <div>
      <h1>{user?.name}'s Profile</h1>
      {/* Profile content */}
    </div>
  )
}
```

### Error Handling
```typescript
function SignInForm() {
  const { signin, isSigningIn, signinError } = useAuth()
  
  const handleSubmit = async (data) => {
    try {
      await signin(data)
      router.push('/dashboard')
    } catch (error) {
      // Error is automatically handled by React Query
      console.error('Signin failed:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {signinError && (
        <div>Error: {signinError.response?.data?.error}</div>
      )}
      {/* Form fields */}
      <button disabled={isSigningIn}>
        {isSigningIn ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}
```

## 🚀 Benefits

### React Query Integration
- **Automatic Caching** - User data cached across components
- **Background Refetching** - Keeps data fresh automatically  
- **Optimistic Updates** - Instant UI updates
- **Error Handling** - Built-in error states and retry logic
- **Loading States** - Automatic loading indicators
- **Devtools** - Debug queries in development

### Axios Benefits
- **Interceptors** - Automatic token handling
- **Request/Response Transformation** - Consistent data format
- **Error Handling** - Centralized error processing
- **Timeout Handling** - Prevents hanging requests

### Type Safety
- Full TypeScript support
- Type-safe API calls
- IntelliSense for all auth functions

### Performance
- Request deduplication
- Background cache updates
- Minimal re-renders
- Automatic garbage collection

This authentication system provides a solid foundation for secure, scalable user management in your MealDeal application.




