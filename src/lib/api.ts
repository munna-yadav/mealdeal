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
    latitude?: number
    longitude?: number
    phone?: string
    hours?: string
    image?: string
  }) => api.post('/restaurants', data),

  // Update restaurant
  update: (data: {
    id: number
    name: string
    cuisine: string
    description?: string
    location: string
    latitude?: number
    longitude?: number
    phone?: string
    hours?: string
    image?: string
  }) => api.put('/restaurants', data),
  
  // Get restaurants with search and location filtering
  getAll: (params?: {
    search?: string
    cuisine?: string
    location?: string
    lat?: number
    lng?: number
    radius?: number
    sortBy?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.cuisine) searchParams.append('cuisine', params.cuisine)
    if (params?.location) searchParams.append('location', params.location)
    if (params?.lat) searchParams.append('lat', params.lat.toString())
    if (params?.lng) searchParams.append('lng', params.lng.toString())
    if (params?.radius) searchParams.append('radius', params.radius.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    
    const queryString = searchParams.toString()
    return api.get(`/restaurants${queryString ? `?${queryString}` : ''}`)
  },
  
  // Get restaurants by owner
  getByOwner: (ownerId: number) => api.get(`/restaurants?ownerId=${ownerId}`),

  // Get restaurant by ID
  getById: (id: number) => api.get(`/restaurants/${id}`),
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
  
  // Get offers with search and location filtering
  getAll: (params?: {
    activeOnly?: boolean
    search?: string
    cuisine?: string
    location?: string
    discount?: string
    lat?: number
    lng?: number
    radius?: number
    sortBy?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.activeOnly) searchParams.append('activeOnly', 'true')
    if (params?.search) searchParams.append('search', params.search)
    if (params?.cuisine) searchParams.append('cuisine', params.cuisine)
    if (params?.location) searchParams.append('location', params.location)
    if (params?.discount) searchParams.append('discount', params.discount)
    if (params?.lat) searchParams.append('lat', params.lat.toString())
    if (params?.lng) searchParams.append('lng', params.lng.toString())
    if (params?.radius) searchParams.append('radius', params.radius.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    
    const queryString = searchParams.toString()
    return api.get(`/offers${queryString ? `?${queryString}` : ''}`)
  },
  
  // Get offers by restaurant
  getByRestaurant: (restaurantId: number, activeOnly = false) => 
    api.get(`/offers?restaurantId=${restaurantId}&activeOnly=${activeOnly}`),
}

// Deals API functions
export const dealsAPI = {
  // Claim a deal
  claim: (offerId: number) => api.post('/deals/claim', { offerId }),
  
  // Get user's claimed deals
  getClaimed: () => api.get('/deals/claim'),
}

// Reservations API functions
export const reservationsAPI = {
  // Create a reservation
  create: (data: {
    restaurantId: number
    date: string
    time: string
    partySize: number
    specialRequests?: string
    phoneNumber?: string
    email?: string
  }) => api.post('/reservations', data),
  
  // Get user's reservations
  getAll: (params?: {
    restaurantId?: number
    status?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.restaurantId) searchParams.append('restaurantId', params.restaurantId.toString())
    if (params?.status) searchParams.append('status', params.status)
    
    const queryString = searchParams.toString()
    return api.get(`/reservations${queryString ? `?${queryString}` : ''}`)
  },
  
  // Update reservation status
  updateStatus: (reservationId: number, status: string) => 
    api.patch('/reservations', { reservationId, status }),
}

// User types
export interface User {
  id: number
  name: string
  email: string
  isVerified: boolean
  createdAt: string
}



