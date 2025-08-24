import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Edit } from "lucide-react"
import type { Restaurant } from "@/hooks/useRestaurants"

interface RestaurantListCardProps {
  restaurant: Restaurant
  showOwnerActions?: boolean
}

export function RestaurantListCard({ restaurant, showOwnerActions = false }: RestaurantListCardProps) {
  const activeOffers = restaurant.offers.filter(
    offer => offer.isActive && new Date(offer.expiresAt) > new Date()
  )

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group hover:scale-[1.02]">
      <div className="relative h-48">
        <Image
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Offer Badge */}
        {activeOffers.length > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-green-500 text-white">
              {activeOffers.length} deal{activeOffers.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link 
            href={`/restaurant/${restaurant.id}`}
            className="group-hover:text-primary transition-colors"
          >
            <h3 className="text-lg font-semibold line-clamp-1">
              {restaurant.name}
            </h3>
          </Link>
          {!showOwnerActions && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{restaurant.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>{restaurant.reviewCount} reviews</span>
            {!showOwnerActions && (
              <span>By {restaurant.owner.name}</span>
            )}
          </div>
          
          {showOwnerActions ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/restaurant/${restaurant.id}`}>
                  View
                </Link>
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/restaurant/${restaurant.id}`}>
                View Details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

