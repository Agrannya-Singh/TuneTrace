// This file is no longer needed with the new architecture, but we'll keep it to avoid breaking changes if it was referenced elsewhere.
// The new, preferred way to get songs is via /api/songs

import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return new NextResponse(JSON.stringify({ error: 'This endpoint is deprecated. Please use /api/songs.' }), { status: 404, headers: { 'Content-Type': 'application/json' }});
}
