import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import { useState } from 'react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelService.getHotelById(id)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        <p className="font-semibold">Error loading hotel details</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % hotel.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + hotel.photos.length) % hotel.photos.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Hotels
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-[400px] max-w-4xl mx-auto p-4">
          <img
            src={hotel.photos[currentPhotoIndex]}
            alt={`${hotel.name} - Photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/src/assets/images/hotel1.jpg';
            }}
          />
          {hotel.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
            <h1 className="text-2xl font-bold text-white">{hotel.name}</h1>
            <p className="text-white text-sm mt-1">{hotel.location}</p>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-6 h-6 ${
                  index < hotel.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">({hotel.rating} stars)</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{hotel.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {hotel.activities && hotel.activities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.activities.map((activity, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">${hotel.price}/night</div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}