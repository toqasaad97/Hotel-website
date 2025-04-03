import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { hotelService } from '../services/api';
import { useState, useEffect, useCallback } from 'react';

export default function HotelList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowLoading(true);
  }, []);

  // Debounce the search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
        setShowLoading(false);
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    } else {
      setDebouncedSearchQuery('');
      setShowLoading(false);
    }
  }, [searchQuery]);

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels', debouncedSearchQuery],
    queryFn: () => hotelService.getAllHotels(debouncedSearchQuery)
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center text-red-500 p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-semibold mb-2">Error loading hotels</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search hotels by name or location..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading || showLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-5 w-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hotels?.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No hotels found</h2>
            <p className="text-gray-600 mb-4">We couldn't find any hotels matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels?.map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotels/${hotel.id}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64">
                  <img
                    src={hotel.photos[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/src/assets/images/hotel1.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-sm font-semibold text-blue-600 shadow-md">
                    ${hotel.price}/night
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {hotel.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < hotel.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600">({hotel.rating})</span>
                    </div>
                    <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300">
                      View Details →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}