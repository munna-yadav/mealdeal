import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock } from "lucide-react"

interface RestaurantCardProps {
  id: string
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  location: string
  deliveryTime: string
  image: string
  dealCount: number
  minDiscount: number
}

export function RestaurantCard({
  id,
  name,
  cuisine,
  rating,
  reviewCount,
  location,
  deliveryTime,
  image,
  dealCount,
  minDiscount
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${id}`}>
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 flex gap-2">
              {dealCount > 0 && (
                <Badge variant="destructive" className="bg-red-500 text-white">
                  {dealCount} Deal{dealCount > 1 ? 's' : ''}
                </Badge>
              )}
              {minDiscount > 0 && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  Up to {minDiscount}% OFF
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{cuisine}</p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {deliveryTime}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}


