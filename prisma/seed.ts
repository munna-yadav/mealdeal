import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create a demo user to own the restaurants
  const hashedPassword = await bcrypt.hash('demo123', 10)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mealdeal.com' },
    update: {},
    create: {
      name: 'Demo Restaurant Owner',
      email: 'demo@mealdeal.com',
      password: hashedPassword,
      isVerified: true,
    },
  })

  console.log('👤 Created demo user:', demoUser.email)

  // Real restaurant data
  const restaurantsData = [
    {
      name: 'Bella Vista',
      cuisine: 'Italian',
      description: 'Experience authentic Italian cuisine in an elegant atmosphere. Our chefs use traditional recipes passed down through generations, featuring fresh ingredients imported directly from Italy.',
      location: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
      rating: 4.8,
      reviewCount: 324,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Sakura Sushi',
      cuisine: 'Japanese',
      description: 'Authentic Japanese sushi bar with the freshest fish and traditional techniques. Our master sushi chef brings 20 years of experience from Tokyo.',
      location: '456 Cherry Blossom Ave, Midtown',
      phone: '(555) 234-5678',
      hours: 'Tue-Sun: 5:00 PM - 11:00 PM',
      rating: 4.6,
      reviewCount: 198,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Urban Grill',
      cuisine: 'American',
      description: 'Modern American cuisine with a focus on locally sourced ingredients. Famous for our gourmet burgers and craft beer selection.',
      location: '789 Liberty St, West Side',
      phone: '(555) 345-6789',
      hours: 'Mon-Sun: 12:00 PM - 10:00 PM',
      rating: 4.4,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Spice Route',
      cuisine: 'Indian',
      description: 'Traditional Indian curry house with authentic spices and recipes from various regions of India. Vegetarian and vegan options available.',
      location: '321 Curry Lane, East Village',
      phone: '(555) 456-7890',
      hours: 'Mon-Sun: 11:30 AM - 9:30 PM',
      rating: 4.7,
      reviewCount: 267,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Ocean Fresh',
      cuisine: 'Hawaiian',
      description: 'Fresh poke bowls and Hawaiian-inspired dishes made with sustainable seafood and tropical ingredients.',
      location: '654 Beach Blvd, Beachside',
      phone: '(555) 567-8901',
      hours: 'Mon-Sun: 10:00 AM - 9:00 PM',
      rating: 4.5,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Smoky Joe\'s BBQ',
      cuisine: 'BBQ',
      description: 'Authentic Texas-style BBQ with slow-smoked meats and homemade sides. Family recipes passed down for three generations.',
      location: '987 Smokehouse Rd, Southside',
      phone: '(555) 678-9012',
      hours: 'Wed-Sun: 11:00 AM - 9:00 PM',
      rating: 4.3,
      reviewCount: 203,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Noodle Bar Tokyo',
      cuisine: 'Japanese',
      description: 'Authentic ramen bar specializing in tonkotsu, miso, and shoyu broths. Each bowl is crafted with care and traditional techniques.',
      location: '159 Ramen St, Little Tokyo',
      phone: '(555) 789-0123',
      hours: 'Mon-Sat: 6:00 PM - 12:00 AM',
      rating: 4.6,
      reviewCount: 145,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'La Cantina Mexicana',
      cuisine: 'Mexican',
      description: 'Vibrant Mexican restaurant with traditional dishes and modern twists. Fresh guacamole made tableside and extensive tequila selection.',
      location: '753 Fiesta Way, Mexican Quarter',
      phone: '(555) 890-1234',
      hours: 'Mon-Sun: 11:00 AM - 11:00 PM',
      rating: 4.2,
      reviewCount: 178,
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
  ]

  // Create restaurants
  const createdRestaurants = []
  for (const restaurantData of restaurantsData) {
    const restaurant = await prisma.restaurant.create({
      data: restaurantData,
    })
    createdRestaurants.push(restaurant)
    console.log('🏪 Created restaurant:', restaurant.name)
  }

  // Create offers for restaurants
  const offersData = [
    // Bella Vista offers
    {
      title: '3-Course Italian Dinner for Two',
      description: 'Includes appetizer, main course, and dessert. Perfect for a romantic evening.',
      originalPrice: 120,
      discountedPrice: 60,
      discount: 50,
      terms: 'Valid for dinner only. Cannot be combined with other offers. Reservations required.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      restaurantId: createdRestaurants[0].id, // Bella Vista
    },
    {
      title: 'Wine Tasting Experience',
      description: 'Taste 6 premium Italian wines with cheese and charcuterie pairing.',
      originalPrice: 85,
      discountedPrice: 55,
      discount: 35,
      terms: 'Available weekends only. Must be 21+. Advanced booking required.',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      restaurantId: createdRestaurants[0].id, // Bella Vista
    },
    
    // Sakura Sushi offers
    {
      title: 'All-You-Can-Eat Sushi',
      description: 'Unlimited sushi, sashimi, and rolls for 2 hours. Fresh fish daily.',
      originalPrice: 80,
      discountedPrice: 56,
      discount: 30,
      terms: 'Time limit 2 hours. No sharing. Leftover food will be charged.',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      restaurantId: createdRestaurants[1].id, // Sakura Sushi
    },
    {
      title: 'Omakase Experience',
      description: 'Chef\'s choice premium sushi course with 12 pieces and miso soup.',
      originalPrice: 150,
      discountedPrice: 105,
      discount: 30,
      terms: 'Chef\'s selection only. Dietary restrictions must be mentioned in advance.',
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      restaurantId: createdRestaurants[1].id, // Sakura Sushi
    },
    
    // Urban Grill offers
    {
      title: 'Gourmet Burger & Craft Beer',
      description: 'Premium beef burger with fries and choice of craft beer.',
      originalPrice: 32,
      discountedPrice: 24,
      discount: 25,
      terms: 'One beer per person. Must be 21+ for alcohol.',
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      restaurantId: createdRestaurants[2].id, // Urban Grill
    },
    
    // Spice Route offers
    {
      title: 'Authentic Butter Chicken & Naan',
      description: 'Signature butter chicken with basmati rice, naan bread, and chai tea.',
      originalPrice: 45,
      discountedPrice: 27,
      discount: 40,
      terms: 'Spice level can be adjusted. Includes dessert of the day.',
      expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      restaurantId: createdRestaurants[3].id, // Spice Route
    },
    {
      title: 'Vegetarian Thali Special',
      description: 'Complete vegetarian meal with 6 dishes, rice, bread, and dessert.',
      originalPrice: 38,
      discountedPrice: 23,
      discount: 40,
      terms: 'Completely vegetarian. Vegan options available upon request.',
      expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      restaurantId: createdRestaurants[3].id, // Spice Route
    },
    
    // Ocean Fresh offers
    {
      title: 'Fresh Poke Bowl & Smoothie',
      description: 'Build your own poke bowl with premium fish and fresh tropical smoothie.',
      originalPrice: 28,
      discountedPrice: 18,
      discount: 36,
      terms: 'Choice of ahi tuna or salmon. Smoothie flavors vary daily.',
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      restaurantId: createdRestaurants[4].id, // Ocean Fresh
    },
    
    // Smoky Joe's offers
    {
      title: 'BBQ Ribs Feast for Family',
      description: 'Full rack of ribs with 3 sides and cornbread. Serves 3-4 people.',
      originalPrice: 85,
      discountedPrice: 47,
      discount: 45,
      terms: 'Sides include coleslaw, baked beans, and mac & cheese. Take-out available.',
      expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      restaurantId: createdRestaurants[5].id, // Smoky Joe's
    },
    
    // Noodle Bar offers
    {
      title: 'Authentic Ramen & Gyoza',
      description: 'Choice of tonkotsu, miso, or shoyu ramen with 5-piece pork gyoza.',
      originalPrice: 35,
      discountedPrice: 28,
      discount: 20,
      terms: 'Extra toppings available for additional charge. No modifications to broth.',
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      restaurantId: createdRestaurants[6].id, // Noodle Bar Tokyo
    },
    
    // La Cantina offers
    {
      title: 'Taco Tuesday Special',
      description: '3 street tacos with your choice of meat, rice, beans, and margarita.',
      originalPrice: 25,
      discountedPrice: 18,
      discount: 28,
      terms: 'Available Tuesdays only. Must be 21+ for margarita. Virgin options available.',
      expiresAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
      restaurantId: createdRestaurants[7].id, // La Cantina
    },
    {
      title: 'Fajitas Fiesta for Two',
      description: 'Sizzling chicken and beef fajitas with all the fixings for two people.',
      originalPrice: 55,
      discountedPrice: 39,
      discount: 29,
      terms: 'Includes guacamole, sour cream, cheese, and unlimited tortillas.',
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      restaurantId: createdRestaurants[7].id, // La Cantina
    },
  ]

  // Create offers
  for (const offerData of offersData) {
    const offer = await prisma.offer.create({
      data: offerData,
    })
    console.log('🎯 Created offer:', offer.title)
  }

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created: ${createdRestaurants.length} restaurants and ${offersData.length} offers`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
