'use server';

import { type NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * Handles POST requests to log error information with context to a server-side log file.
 *
 * Expects a JSON body containing `error` and `context` fields. If either field is missing, responds with a 400 status and an error message. On success, appends a timestamped log entry to `recommendation-errors.log` and returns a 200 status with a confirmation message. If an internal error occurs, responds with a 500 status and error details.
 *
 * @returns A NextResponse indicating the result of the logging operation.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error, context } = body;

    if (!error || !context) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing error or context in request body.' }),
        { status: 400 }
      );
    }

    const logFilePath = path.join(process.cwd(), 'recommendation-errors.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Error during "${context}": ${JSON.stringify(error)}\n`;

    await fs.appendFile(logFilePath, logMessage);

    return new NextResponse(JSON.stringify({ message: 'Error logged successfully.' }), { status: 200 });
  } catch (e) {
    console.error('Logging API Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during logging.';
    return new NextResponse(JSON.stringify({ message: 'Failed to log error.', error: errorMessage }), { status: 500 });
  }
}
