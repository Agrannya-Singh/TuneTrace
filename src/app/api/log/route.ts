'use server';

import { type NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error, songName } = body;

    if (!error || !songName) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing error or songName in request body.' }),
        { status: 400 }
      );
    }

    const logFilePath = path.join(process.cwd(), 'recommendation-errors.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Error for song "${songName}": ${JSON.stringify(error)}\n`;

    await fs.appendFile(logFilePath, logMessage);

    return new NextResponse(JSON.stringify({ message: 'Error logged successfully.' }), { status: 200 });
  } catch (e) {
    console.error('Logging API Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during logging.';
    return new NextResponse(JSON.stringify({ message: 'Failed to log error.', error: errorMessage }), { status: 500 });
  }
}
