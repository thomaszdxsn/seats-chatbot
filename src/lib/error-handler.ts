export interface ErrorResponse {
  error: string;
  type: string;
  timestamp: string;
  statusCode: number;
}

export function createErrorResponse(error: unknown): ErrorResponse {
  let errorMessage = 'Internal server error';
  let statusCode = 500;
  let errorType = 'UnknownError';

  if (error instanceof Error) {
    errorType = error.name;
    
    if (error.name === 'ConnectTimeoutError' || 'code' in error && error.code === 'UND_ERR_CONNECT_TIMEOUT') {
      errorMessage = 'Connection timeout - Please check your network connection or proxy settings';
      statusCode = 408;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Network error - Unable to connect to AI service';
      statusCode = 503;
    } else if (error.message) {
      errorMessage = error.message;
    }
  }

  return {
    error: errorMessage,
    type: errorType,
    timestamp: new Date().toISOString(),
    statusCode,
  };
}

export function createErrorHttpResponse(errorResponse: ErrorResponse): Response {
  return new Response(JSON.stringify({
    error: errorResponse.error,
    type: errorResponse.type,
    timestamp: errorResponse.timestamp
  }), {
    status: errorResponse.statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
  });
}