import axios from 'axios';

const API_URL = 'https://hotels.expotb.com/api';

// Default hotel images from assets
const defaultHotelImages = [
  '/src/assets/images/hotel1.jpg',
  '/src/assets/images/hotel2.jpg',
  '/src/assets/images/hotel3.jpg'
];

// Cache for storing search results
const searchCache = new Map();

export const hotelService = {
  getAllHotels: async (searchQuery = '') => {
    try {
      // Check cache first
      const cacheKey = searchQuery || 'all';
      if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
      }

      const response = await axios.get(`${API_URL}/searchHotels`);

      // Filter hotels based on search query if provided
      let hotels = response.data.data;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        hotels = hotels.filter(hotel =>
          hotel.name.toLowerCase().includes(query) ||
          hotel.address.toLowerCase().includes(query)
        );
      }

      const formattedHotels = hotels.map(hotel => ({
        id: hotel._id,
        name: hotel.name,
        location: hotel.address,
        price: Math.floor(Math.random() * (500 - 100) + 100), // Random price for demo
        photos: hotel.photos?.length ? hotel.photos : defaultHotelImages,
        rating: hotel.star_rating || 0,
        description: hotel.description,
        amenities: [
          ...(hotel.General || []),
          ...(hotel.Internet || []),
          ...(hotel.Parking || []),
          ...(hotel.Services || [])
        ]
      }));

      // Cache the results
      searchCache.set(cacheKey, formattedHotels);
      return formattedHotels;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch hotels. Please try again later.');
    }
  },

  getHotelById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/displayHotel/${id}`);
      const hotel = response.data.data;

      if (!hotel) {
        throw new Error('Hotel not found');
      }

      return {
        id: hotel._id,
        name: hotel.name,
        location: hotel.address,
        price: Math.floor(Math.random() * (500 - 100) + 100), // Random price for demo
        photos: hotel.photos?.length ? hotel.photos : defaultHotelImages,
        rating: hotel.star_rating || 0,
        description: hotel.description,
        amenities: [
          ...(hotel.General || []),
          ...(hotel.Internet || []),
          ...(hotel.Parking || []),
          ...(hotel.Services || [])
        ],
        activities: hotel.Activities || []
      };
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch hotel details. Please try again later.');
    }
  }
};