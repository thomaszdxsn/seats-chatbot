import React from 'react';
import type { PointsYeahHotelResponse, HotelSearchInput } from '@/lib/pointsyeah/hotel-api';

interface PointsYeahHotelResultsProps {
  data: PointsYeahHotelResponse;
  searchParams?: HotelSearchInput;
}

export default function PointsYeahHotelResults({ data }: PointsYeahHotelResultsProps) {
  if (!data?.results?.length) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          No reward hotel options found for your search criteria.
        </p>
      </div>
    );
  }

  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };


  return (
    <div className="space-y-4">
      {/* 2-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.results.map((result, index) => (
          <div key={`${result.property.property_id}-${index}`} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Hotel image with overlay */}
            <div
              className="relative h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${result.property.image})` }}
            >
              {/* Location overlay */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                <span className="text-xs">📍</span>
                <span>{result.property.location.city}({result.property.location.country_code})</span>
              </div>

              {/* Featured badge */}
              {result.featured && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  ⚡
                </div>
              )}
            </div>

            {/* Hotel details */}
            <div className="p-4">
              {/* Hotel name and room type */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {result.property.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="capitalize">{result.room_type}</span>
                  <span className="text-orange-500">Award Calendar</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                  <span>{result.property.tags?.[0] || 'City'}</span>
                </div>
              </div>

              {/* Pricing section */}
              <div className="">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">From</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {formatPoints(result.points)} Pts
                  </span>
                  {result.cash_price > 0 && (
                    <>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Or</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatPrice(result.cash_price)}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {new Date(result.updated_at * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results summary */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Showing {data.results.length} of {data.total} total results
      </div>
    </div>
  );
}
