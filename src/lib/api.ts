import axios from 'axios'

// Create axios instance with default config
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - could trigger logout here
      console.warn('Unauthorized request:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  // Get current user
  me: () => api.get('/auth/me'),
  
  // Sign in
  signin: (credentials: { email: string; password: string }) =>
    api.post('/auth/singin', credentials),
  
  // Sign up
  signup: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', userData),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Verify email
  verify: (token: string) => api.get(`/auth/verify?token=${token}`),
}

// Restaurant API functions
export const restaurantAPI = {
  // Create restaurant
  create: (data: {
    name: string
    cuisine: string
    description?: string
    location: string
    phone?: string
    hours?: string
    image?: string
  }) => api.post('/restaurants', data),
  
  // Get restaurants
  getAll: () => api.get('/restaurants'),
  
  // Get restaurants by owner
  getByOwner: (ownerId: number) => api.get(`/restaurants?ownerId=${ownerId}`),
}

// Offer API functions
export const offerAPI = {
  // Create offer
  create: (data: {
    title: string
    description?: string
    originalPrice: string
    discountedPrice: string
    discount: string
    terms?: string
    expiresAt: string
    restaurantId: string
  }) => api.post('/offers', data),
  
  // Get offers
  getAll: (activeOnly = false) => api.get(`/offers?activeOnly=${activeOnly}`),
  
  // Get offers by restaurant
  getByRestaurant: (restaurantId: number, activeOnly = false) => 
    api.get(`/offers?restaurantId=${restaurantId}&activeOnly=${activeOnly}`),
}

// User types
export interface User {
  id: number
  name: string
  email: string
  isVerified: boolean
  createdAt: string
}



