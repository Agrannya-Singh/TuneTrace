'use server';

import { type NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This endpoint is deprecated. The frontend now communicates directly with the Python backend.
 * This endpoint is kept for backward compatibility but returns a deprecation notice.
 */
export async function GET(req: NextRequest) {
  return new NextResponse(
    JSON.stringify({ 
      error: 'This endpoint is deprecated. Please use the Python backend directly.',
      message: 'The frontend now communicates with the Python ML backend for all song operations.'
    }),
    { 
      status: 410, // Gone - resource is permanently unavailable
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
