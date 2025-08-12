import { FlightData } from './types';

interface FlightResultsProps {
  flights: FlightData[];
  summary?: string;
}

export function FlightResults({ flights, summary }: FlightResultsProps) {
  if (!flights || flights.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200">No flights found</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
        ✈️ Flight Search Results
      </h3>
      
      {summary && (
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 bg-blue-100 dark:bg-blue-800/30 p-2 rounded">
          {summary}
        </p>
      )}
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {flights.slice(0, 5).map((flight, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {flight.departure_airport?.name} → {flight.arrival_airport?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {flight.departure_airport?.id} → {flight.arrival_airport?.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ¥{flight.price}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{flight.type}</p>
              </div>
            </div>
            
            {flight.flights && flight.flights.length > 0 && (
              <div className="space-y-2">
                {flight.flights.map((segment, segIndex: number) => (
                  <div key={segIndex} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={segment.airline_logo} 
                        alt={segment.airline}
                        className="w-6 h-6 rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {segment.airline} {segment.flight_number}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {Math.floor(segment.duration / 60)}h {segment.duration % 60}m
                          {segment.legroom && ` • ${segment.legroom}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                      <p>{segment.departure_airport?.time}</p>
                      <p>{segment.arrival_airport?.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {flight.book_link && (
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                <a
                  href={flight.book_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                >
                  Book Flight →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {flights.length > 5 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
          Showing 5 of {flights.length} results
        </p>
      )}
    </div>
  );
}