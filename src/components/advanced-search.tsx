"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LocationSearch } from "@/components/location-search"
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react"
import { type LocationData } from "@/lib/geolocation"

interface SearchFilters {
  search: string
  cuisine: string
  location: string
  discount: string
  sortBy: string
}

interface LocationFilters {
  userLocation?: LocationData | null
  radius?: number
}

interface AdvancedSearchProps {
  onSearchChange: (filters: SearchFilters & LocationFilters) => void
  availableFilters?: {
    cuisines?: string[]
    locations?: string[]
  }
  searchType?: 'restaurants' | 'deals'
  placeholder?: string
  initialFilters?: Partial<SearchFilters>
  showLocationSearch?: boolean
  className?: string
}

export function AdvancedSearch({
  onSearchChange,
  availableFilters = {},
  searchType = 'restaurants',
  placeholder = "Search restaurants, cuisine, or deals...",
  initialFilters = {},
  showLocationSearch = true,
  className = ""
}: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    cuisine: 'all',
    location: 'all',
    discount: 'all',
    sortBy: searchType === 'restaurants' ? 'rating' : 'discount',
    ...initialFilters
  })
  const [locationFilters, setLocationFilters] = useState<LocationFilters>({})

  // Initialize with initial filters
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      // Don't trigger search on initial mount if parent will handle it
      return
    }
  }, [isInitialized])

  // Update parent when filters change (with debouncing for search text)
  useEffect(() => {
    if (!isInitialized) return // Skip initial call

    const timeoutId = setTimeout(() => {
      onSearchChange({ ...filters, ...locationFilters })
    }, filters.search ? 300 : 0) // Debounce search text, immediate for other filters

    return () => clearTimeout(timeoutId)
  }, [filters, locationFilters, isInitialized]) // Remove onSearchChange from dependencies

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleLocationChange = (userLocation: LocationData | null, radius?: number) => {
    setLocationFilters({ userLocation, radius })
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      cuisine: 'all',
      location: 'all',
      discount: 'all',
      sortBy: searchType === 'restaurants' ? 'rating' : 'discount'
    })
    setLocationFilters({})
  }

  const hasActiveFilters = filters.search || 
    filters.cuisine !== 'all' || 
    filters.location !== 'all' || 
    filters.discount !== 'all' ||
    locationFilters.userLocation

  const getSortOptions = () => {
    if (searchType === 'restaurants') {
      return [
        { value: 'rating', label: 'Highest Rated' },
        { value: 'name', label: 'Name A-Z' },
        { value: 'created', label: 'Newest' },
        { value: 'offers', label: 'Most Offers' },
        ...(locationFilters.userLocation ? [{ value: 'distance', label: 'Nearest' }] : [])
      ]
    } else {
      return [
        { value: 'discount', label: 'Highest Discount' },
        { value: 'price', label: 'Lowest Price' },
        { value: 'rating', label: 'Highest Rating' },
        { value: 'expiry', label: 'Expiring Soon' },
        ...(locationFilters.userLocation ? [{ value: 'distance', label: 'Nearest' }] : [])
      ]
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10 pr-12"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          <Filter className="h-4 w-4 mr-1" />
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Advanced Filters
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-sm"
                  >
                    Clear all
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Search */}
              {showLocationSearch && (
                <div>
                  <LocationSearch
                    onLocationChange={handleLocationChange}
                    currentLocation={locationFilters.userLocation}
                    radius={locationFilters.radius}
                  />
                </div>
              )}

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Cuisine Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Cuisine</label>
                  <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange('cuisine', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cuisines</SelectItem>
                      {availableFilters.cuisines?.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Area</label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Areas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {availableFilters.locations?.map((location) => (
                        <SelectItem key={location} value={location.toLowerCase()}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount Filter (for deals) */}
                {searchType === 'deals' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Discount</label>
                    <Select value={filters.discount} onValueChange={(value) => handleFilterChange('discount', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Discounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Discounts</SelectItem>
                        <SelectItem value="high">40%+ Off</SelectItem>
                        <SelectItem value="medium">25-39% Off</SelectItem>
                        <SelectItem value="low">Under 25% Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSortOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('search', '')}>
              Search: "{filters.search}" <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          
          {filters.cuisine !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('cuisine', 'all')}>
              Cuisine: {filters.cuisine} <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          
          {filters.location !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('location', 'all')}>
              Area: {filters.location} <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          
          {searchType === 'deals' && filters.discount !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('discount', 'all')}>
              Discount: {filters.discount === "high" ? "40%+" : filters.discount === "medium" ? "25-39%" : "Under 25%"} <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          
          {locationFilters.userLocation && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setLocationFilters({})}>
              Near me ({locationFilters.radius}km) <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
