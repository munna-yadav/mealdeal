import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart } from "lucide-react"

interface DealCardProps {
  id: string
  title: string
  restaurant: {
    name: string
    rating: number
    location: string
  }
  discount: number
  originalPrice: number
  discountedPrice: number
  image: string
  expiresIn: string
  cuisine: string
  isFavorite?: boolean
}

export function DealCard({ 
  id, 
  title, 
  restaurant, 
  discount, 
  originalPrice, 
  discountedPrice, 
  image, 
  expiresIn, 
  cuisine,
  isFavorite = false 
}: DealCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="destructive" className="bg-red-500 text-white">
              {discount}% OFF
            </Badge>
            <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
              {cuisine}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/40"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            <span className="sr-only">Add to favorites</span>
          </Button>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {expiresIn}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          
          <div className="flex items-center justify-between">
            <Link 
              href={`/restaurant/${id}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-medium">{restaurant.name}</span>
            </Link>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {restaurant.location}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">${discountedPrice}</span>
            <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/restaurant/${id}`}>
            View Deal
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


