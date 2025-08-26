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

  // Real restaurant data with coordinates
  const restaurantsData = [
    {
      name: 'Bella Vista',
      cuisine: 'Italian',
      description: 'Experience authentic Italian cuisine in an elegant atmosphere. Our chefs use traditional recipes passed down through generations, featuring fresh ingredients imported directly from Italy.',
      location: '123 Main St, Downtown',
      latitude: 40.7831,
      longitude: -73.9712,
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
      latitude: 40.7484,
      longitude: -73.9857,
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
      latitude: 40.7282,
      longitude: -74.0776,
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
      latitude: 40.7282,
      longitude: -73.9942,
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
    {
      name: 'Golden Dragon',
      cuisine: 'Chinese',
      description: 'Authentic Cantonese cuisine with traditional dim sum and wok-fried specialties. Family-owned for over 30 years.',
      location: '888 Dragon Court, Chinatown',
      latitude: 40.7589,
      longitude: -73.9851,
      phone: '(555) 123-8888',
      hours: 'Daily: 10:00 AM - 10:00 PM',
      rating: 4.5,
      reviewCount: 312,
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Cafe Milano',
      cuisine: 'Italian',
      description: 'Cozy Italian cafe with handmade pasta, wood-fired pizzas, and artisanal gelato. Perfect for casual dining.',
      location: '246 Little Italy St, Historic District',
      latitude: 40.7194,
      longitude: -73.9927,
      phone: '(555) 234-5679',
      hours: 'Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM',
      rating: 4.3,
      reviewCount: 187,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'The Steakhouse Prime',
      cuisine: 'American',
      description: 'Premium steakhouse featuring USDA Prime cuts, extensive wine list, and elegant atmosphere for special occasions.',
      location: '101 Prime Ave, Financial District',
      latitude: 40.7074,
      longitude: -74.0113,
      phone: '(555) 345-7890',
      hours: 'Mon-Sat: 5:00 PM - 11:00 PM, Sun: 4:00 PM - 9:00 PM',
      rating: 4.8,
      reviewCount: 445,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Thai Garden',
      cuisine: 'Thai',
      description: 'Traditional Thai cuisine with authentic flavors and fresh herbs. Extensive vegetarian menu and customizable spice levels.',
      location: '369 Spice Market Rd, Asian Village',
      latitude: 40.7505,
      longitude: -73.9934,
      phone: '(555) 456-7891',
      hours: 'Tue-Sun: 11:30 AM - 9:30 PM',
      rating: 4.4,
      reviewCount: 201,
      image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Bistro Francais',
      cuisine: 'French',
      description: 'Authentic French bistro with classic dishes, extensive wine selection, and charming Parisian atmosphere.',
      location: '47 Rue de la Paix, French Quarter',
      latitude: 40.7419,
      longitude: -73.9891,
      phone: '(555) 567-8902',
      hours: 'Wed-Mon: 5:30 PM - 10:00 PM',
      rating: 4.6,
      reviewCount: 298,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Seoul Kitchen',
      cuisine: 'Korean',
      description: 'Modern Korean BBQ and traditional dishes with tabletop grilling and all-you-can-eat banchan.',
      location: '789 K-Town Plaza, Koreatown',
      latitude: 40.7505,
      longitude: -73.9855,
      phone: '(555) 678-9013',
      hours: 'Daily: 12:00 PM - 11:00 PM',
      rating: 4.5,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Mediterranean Breeze',
      cuisine: 'Mediterranean',
      description: 'Fresh Mediterranean cuisine with grilled seafood, mezze platters, and house-made hummus and pita.',
      location: '258 Olive Grove Ave, Harbor District',
      latitude: 40.7282,
      longitude: -74.0444,
      phone: '(555) 789-0124',
      hours: 'Mon-Sat: 11:00 AM - 9:00 PM, Sun: 12:00 PM - 8:00 PM',
      rating: 4.3,
      reviewCount: 223,
      image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Pho Saigon',
      cuisine: 'Vietnamese',
      description: 'Authentic Vietnamese pho and banh mi with homemade broths simmered for 24 hours and fresh herbs.',
      location: '456 Little Saigon St, Vietnam Town',
      latitude: 40.7359,
      longitude: -73.9911,
      phone: '(555) 890-1235',
      hours: 'Daily: 10:00 AM - 9:00 PM',
      rating: 4.4,
      reviewCount: 187,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Brooklyn Heights Deli',
      cuisine: 'American',
      description: 'Classic New York deli with towering pastrami sandwiches, fresh bagels, and traditional Jewish-style dishes.',
      location: '147 Heights Blvd, Brooklyn Heights',
      latitude: 40.6962,
      longitude: -73.9969,
      phone: '(555) 901-2346',
      hours: 'Daily: 7:00 AM - 7:00 PM',
      rating: 4.2,
      reviewCount: 341,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Tapas Barcelona',
      cuisine: 'Spanish',
      description: 'Spanish tapas bar with authentic small plates, paella, and extensive selection of Spanish wines and sangria.',
      location: '321 Barcelona Way, Spanish District',
      latitude: 40.7383,
      longitude: -73.9944,
      phone: '(555) 012-3457',
      hours: 'Tue-Sun: 4:00 PM - 12:00 AM',
      rating: 4.5,
      reviewCount: 278,
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Green Garden Vegan',
      cuisine: 'Vegan',
      description: 'Plant-based restaurant with creative vegan dishes, fresh smoothie bowls, and sustainable ingredients.',
      location: '852 Green Street, Eco Village',
      latitude: 40.7341,
      longitude: -74.0089,
      phone: '(555) 123-4568',
      hours: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 6:00 PM',
      rating: 4.6,
      reviewCount: 134,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Pizza Corner',
      cuisine: 'Italian',
      description: 'Authentic Neapolitan pizza with wood-fired oven, imported ingredients, and traditional Italian recipes.',
      location: '963 Pizza Plaza, Little Italy',
      latitude: 40.7193,
      longitude: -73.9928,
      phone: '(555) 234-5679',
      hours: 'Daily: 11:00 AM - 11:00 PM',
      rating: 4.4,
      reviewCount: 289,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'Samba Brazilian Grill',
      cuisine: 'Brazilian',
      description: 'All-you-can-eat Brazilian churrasco with endless grilled meats, salad bar, and traditional sides.',
      location: '741 Carnival Avenue, Brazil Quarter',
      latitude: 40.7451,
      longitude: -73.9863,
      phone: '(555) 345-6780',
      hours: 'Daily: 5:00 PM - 10:00 PM',
      rating: 4.7,
      reviewCount: 367,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop',
      ownerId: demoUser.id,
    },
    {
      name: 'The Fish Market',
      cuisine: 'Seafood',
      description: 'Fresh seafood market and restaurant with daily catches, raw bar, and sustainable fishing practices.',
      location: '159 Harbor View, Fisherman\'s Wharf',
      latitude: 40.7051,
      longitude: -74.0179,
      phone: '(555) 456-7891',
      hours: 'Tue-Sat: 11:00 AM - 9:00 PM, Sun: 12:00 PM - 8:00 PM',
      rating: 4.5,
      reviewCount: 201,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
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
    
    // Golden Dragon offers
    {
      title: 'Dim Sum Brunch for 4',
      description: 'Unlimited dim sum selection with jasmine tea for up to 4 people.',
      originalPrice: 88,
      discountedPrice: 59,
      discount: 33,
      terms: 'Weekend brunch only. 2-hour time limit. Must order tea.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[8].id, // Golden Dragon
    },
    {
      title: 'Peking Duck Dinner',
      description: 'Whole Peking duck with pancakes, scallions, and hoisin sauce.',
      originalPrice: 75,
      discountedPrice: 52,
      discount: 31,
      terms: 'Serves 2-3 people. 24-hour advance notice required.',
      expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[8].id, // Golden Dragon
    },
    
    // Cafe Milano offers
    {
      title: 'Pasta & Wine Night',
      description: 'Choice of handmade pasta dish with glass of Italian wine.',
      originalPrice: 35,
      discountedPrice: 25,
      discount: 29,
      terms: 'Available after 6 PM. Must be 21+ for wine. Non-alcoholic options available.',
      expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[9].id, // Cafe Milano
    },
    {
      title: 'Wood-Fired Pizza Special',
      description: 'Large wood-fired pizza with choice of 3 toppings and caesar salad.',
      originalPrice: 28,
      discountedPrice: 19,
      discount: 32,
      terms: 'Dine-in only. Cannot split toppings between halves.',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[9].id, // Cafe Milano
    },
    
    // The Steakhouse Prime offers
    {
      title: 'Prime Ribeye Dinner for Two',
      description: '16oz prime ribeye with sides, dessert, and bottle of wine.',
      originalPrice: 145,
      discountedPrice: 98,
      discount: 32,
      terms: 'Dinner only. Wine selection limited to house options. Reservations required.',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[10].id, // The Steakhouse Prime
    },
    {
      title: 'Happy Hour Steak Bites',
      description: 'Tenderloin bites with truffle fries and craft cocktail.',
      originalPrice: 42,
      discountedPrice: 28,
      discount: 33,
      terms: 'Happy hour only (5-7 PM). Bar seating required.',
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[10].id, // The Steakhouse Prime
    },
    
    // Thai Garden offers
    {
      title: 'Thai Curry Feast',
      description: 'Choice of curry, pad thai, spring rolls, and jasmine rice.',
      originalPrice: 32,
      discountedPrice: 22,
      discount: 31,
      terms: 'Spice level customizable. Vegetarian and vegan options available.',
      expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[11].id, // Thai Garden
    },
    {
      title: 'Mango Sticky Rice & Tea Set',
      description: 'Traditional mango sticky rice dessert with Thai tea.',
      originalPrice: 18,
      discountedPrice: 12,
      discount: 33,
      terms: 'Seasonal mango availability. Can be made vegan upon request.',
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[11].id, // Thai Garden
    },
    
    // Bistro Francais offers
    {
      title: 'French Onion Soup & Coq au Vin',
      description: 'Classic French onion soup followed by traditional coq au vin.',
      originalPrice: 48,
      discountedPrice: 33,
      discount: 31,
      terms: 'Wine pairing available for additional cost. Dinner only.',
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[12].id, // Bistro Francais
    },
    {
      title: 'Cheese & Charcuterie Board',
      description: 'Selection of French cheeses and cured meats with wine pairing.',
      originalPrice: 38,
      discountedPrice: 26,
      discount: 32,
      terms: 'Perfect for sharing. Wine pairing included. Must be 21+.',
      expiresAt: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[12].id, // Bistro Francais
    },
    
    // Seoul Kitchen offers
    {
      title: 'Korean BBQ All-You-Can-Eat',
      description: 'Unlimited Korean BBQ with banchan and lettuce wraps for 2 hours.',
      originalPrice: 65,
      discountedPrice: 45,
      discount: 31,
      terms: '2-hour time limit. Minimum 2 people. No sharing between tables.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[13].id, // Seoul Kitchen
    },
    {
      title: 'Bibimbap & Kimchi Combo',
      description: 'Traditional bibimbap with house-made kimchi and miso soup.',
      originalPrice: 24,
      discountedPrice: 17,
      discount: 29,
      terms: 'Choice of protein. Extra gochujang available. Vegetarian option available.',
      expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[13].id, // Seoul Kitchen
    },
    
    // Mediterranean Breeze offers
    {
      title: 'Mezze Platter for Sharing',
      description: 'Large mezze platter with hummus, falafel, dolmas, and pita.',
      originalPrice: 36,
      discountedPrice: 24,
      discount: 33,
      terms: 'Serves 2-3 people. All vegetarian. Vegan options available.',
      expiresAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[14].id, // Mediterranean Breeze
    },
    {
      title: 'Grilled Seafood Platter',
      description: 'Mixed grilled seafood with lemon herb rice and Greek salad.',
      originalPrice: 44,
      discountedPrice: 31,
      discount: 30,
      terms: 'Market fish selection varies daily. Contains shellfish.',
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[14].id, // Mediterranean Breeze
    },
    
    // Pho Saigon offers
    {
      title: 'Pho & Banh Mi Combo',
      description: 'Large bowl of pho with choice of banh mi sandwich.',
      originalPrice: 22,
      discountedPrice: 16,
      discount: 27,
      terms: 'Choice of beef or chicken pho. Vegetarian options available.',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[15].id, // Pho Saigon
    },
    {
      title: 'Vietnamese Spring Roll Feast',
      description: 'Fresh and fried spring rolls with peanut and fish dipping sauces.',
      originalPrice: 28,
      discountedPrice: 19,
      discount: 32,
      terms: 'Contains peanuts and fish sauce. Vegetarian rolls available.',
      expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[15].id, // Pho Saigon
    },
    
    // Brooklyn Heights Deli offers
    {
      title: 'Pastrami on Rye Special',
      description: 'Classic pastrami sandwich with pickle, coleslaw, and chips.',
      originalPrice: 18,
      discountedPrice: 13,
      discount: 28,
      terms: 'Served with house-made pickle. Extra meat available for additional cost.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[16].id, // Brooklyn Heights Deli
    },
    {
      title: 'Bagel & Lox Breakfast',
      description: 'Everything bagel with smoked salmon, cream cheese, and capers.',
      originalPrice: 16,
      discountedPrice: 11,
      discount: 31,
      terms: 'Available until 2 PM. Choice of bagel type.',
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[16].id, // Brooklyn Heights Deli
    },
    
    // Tapas Barcelona offers
    {
      title: 'Tapas Tasting Menu',
      description: '6 chef-selected tapas with sangria for two people.',
      originalPrice: 55,
      discountedPrice: 38,
      discount: 31,
      terms: 'Fixed menu selection. Sangria included. Must be 21+.',
      expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[17].id, // Tapas Barcelona
    },
    {
      title: 'Paella Night Special',
      description: 'Traditional paella valenciana with Spanish wine pairing.',
      originalPrice: 42,
      discountedPrice: 29,
      discount: 31,
      terms: 'Available Friday-Sunday only. Serves 2 people minimum.',
      expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[17].id, // Tapas Barcelona
    },
    
    // Green Garden Vegan offers
    {
      title: 'Plant-Based Buddha Bowl',
      description: 'Quinoa bowl with roasted vegetables, tahini dressing, and smoothie.',
      originalPrice: 26,
      discountedPrice: 18,
      discount: 31,
      terms: 'Completely vegan and gluten-free. Nut-free options available.',
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[18].id, // Green Garden Vegan
    },
    {
      title: 'Vegan Burger & Sweet Potato Fries',
      description: 'House-made black bean burger with avocado and baked sweet potato fries.',
      originalPrice: 22,
      discountedPrice: 16,
      discount: 27,
      terms: 'Made with organic ingredients. Gluten-free bun available.',
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[18].id, // Green Garden Vegan
    },
    
    // Pizza Corner offers
    {
      title: 'Neapolitan Pizza & Gelato',
      description: 'Authentic Neapolitan pizza with choice of artisanal gelato.',
      originalPrice: 32,
      discountedPrice: 23,
      discount: 28,
      terms: 'Wood-fired oven pizza. Gelato flavors change daily.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[19].id, // Pizza Corner
    },
    {
      title: 'Pizza & Wine Date Night',
      description: 'Two personal pizzas with bottle of Italian wine.',
      originalPrice: 48,
      discountedPrice: 34,
      discount: 29,
      terms: 'Perfect for couples. Wine selection varies. Must be 21+.',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[19].id, // Pizza Corner
    },
    
    // Samba Brazilian Grill offers
    {
      title: 'Churrasco Rodizio Experience',
      description: 'All-you-can-eat Brazilian BBQ with salad bar and caipirinhas.',
      originalPrice: 68,
      discountedPrice: 45,
      discount: 34,
      terms: 'Includes unlimited meat service and salad bar. Must be 21+ for caipirinhas.',
      expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[20].id, // Samba Brazilian Grill
    },
    {
      title: 'Feijoada Wednesday Special',
      description: 'Traditional Brazilian feijoada with rice, farofa, and orange slices.',
      originalPrice: 35,
      discountedPrice: 25,
      discount: 29,
      terms: 'Available Wednesdays only. Contains pork. Rice and beans included.',
      expiresAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[20].id, // Samba Brazilian Grill
    },
    
    // The Fish Market offers
    {
      title: 'Daily Catch & Chips',
      description: 'Fresh fish of the day with hand-cut fries and coleslaw.',
      originalPrice: 29,
      discountedPrice: 21,
      discount: 28,
      terms: 'Fish selection varies daily. Preparation style can be chosen.',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[21].id, // The Fish Market
    },
    {
      title: 'Seafood Platter for Two',
      description: 'Mixed seafood platter with lobster, shrimp, oysters, and crab cakes.',
      originalPrice: 85,
      discountedPrice: 59,
      discount: 31,
      terms: 'Market price may vary. Contains shellfish. Served with drawn butter.',
      expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      restaurantId: createdRestaurants[21].id, // The Fish Market
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
