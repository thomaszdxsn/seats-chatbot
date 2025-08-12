/**
 * PointsYeah Flight Results Component
 *
 * Renders PointsYeah flight search results with miles, taxes, transfer partners
 * Uses 2x2 grid layout with card-style design
 */
import React from 'react';
import type { PointsYeahResponse } from '@/lib/pointsyeah/flight-api';
import type { SearchParams } from './types';

interface PointsYeahResultsProps {
  data: PointsYeahResponse;
  searchParams?: SearchParams;
}

const PointsYeahResults: React.FC<PointsYeahResultsProps> = ({ data, searchParams }) => {
  if (!data || !data.results || data.results.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No reward flights found</p>
          {searchParams && (
            <p className="text-sm mt-2">
              Try adjusting your search criteria like cabin class, programs, or dates
            </p>
          )}
        </div>
      </div>
    );
  }

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Updated: just now';
    if (diffInHours === 1) return 'Updated: 1 hour ago';
    if (diffInHours < 24) return `Updated: ${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Updated: 1 day ago';
    return `Updated: ${diffInDays} days ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Reward Flight Results
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {data.total} total results (showing {data.results.length})
        </p>
        {searchParams && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {searchParams.sort && (
              <span className="mr-4">Sort: {searchParams.sort}</span>
            )}
            {searchParams.trip && (
              <span className="mr-4">Trip: {searchParams.trip}</span>
            )}
            {searchParams.max_points && (
              <span className="mr-4">Max Miles: {searchParams.max_points.toLocaleString()}</span>
            )}
            {searchParams.max_tax && (
              <span className="mr-4">Max Tax: ${searchParams.max_tax}</span>
            )}
          </div>
        )}
      </div>

      {/* Results - 2x2 Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.results.map((result, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
          >
            {/* Background Image with Overlay */}
            <div className="relative h-48 overflow-hidden">
              {result.img && (
                <img
                  src={result.img}
                  alt={`${result.arrival.city} destination`}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Destination Title */}
              <div className="absolute top-4 left-4">
                <h4 className="text-white text-lg font-bold drop-shadow-lg leading-tight">
                  {result.arrival.city}, {result.arrival.code}
                </h4>
                <p className="text-white/90 text-xs drop-shadow">
                  ({result.arrival.country_name})
                </p>
              </div>


              {/* Seats Indicator */}
              {result.seats <= 3 && (
                <div className="absolute bottom-4 right-4">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {result.seats} seat{result.seats !== 1 ? 's' : ''} left
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Route Information */}
              <div className="mb-2">
                <h5 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {result.departure.code}-{result.arrival.city}, {result.arrival.code}
                </h5>
              </div>

              {/* Pricing */}
              <div className="mb-2">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
                    <span className="text-xl font-bold text-orange-500">
                      {result.miles.toLocaleString()}
                    </span>
                    <span className="text-xs text-orange-500 font-medium">Pts</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                      + ${result.tax}
                    </span>
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-400 capitalize font-medium">
                    {result.cabin}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>{getTimeAgo(result.updated_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {data.results.length} of {data.total} total results
        </p>
      </div>
    </div>
  );
};

export default PointsYeahResults;
