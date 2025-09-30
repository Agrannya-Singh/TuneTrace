# Authentication Setup (OAuth 2.0 with Google)

This document outlines the authentication setup for the application, which uses NextAuth.js to handle OAuth 2.0 with Google as the identity provider.

## Overview

- **Framework**: Next.js
- **Library**: `next-auth`
- **Provider**: Google
- **Strategy**: JWT (JSON Web Tokens)

The authentication flow is handled by a dynamic API route located at `src/app/api/auth/[...nextauth]/route.ts`. This route is configured to use the Google provider with credentials specified in the environment variables.

The application is wrapped with a `SessionProvider` in `src/app/layout.tsx` to make the user session available globally. UI components like `src/components/auth-button.tsx` use the `useSession` hook to display the user's authentication state and provide sign-in/sign-out functionality.

## Google Cloud Console Setup

To enable Google login, you must configure an OAuth 2.0 Client ID in the Google Cloud Platform (GCP) Console.

1.  **Create a new GCP Project** (or use an existing one) at [console.cloud.google.com](https://console.cloud.google.com/).

2.  **Enable the Google People API**:
    -   Navigate to "APIs & Services" > "Library".
    -   Search for "Google People API" and enable it for your project.

3.  **Configure the OAuth Consent Screen**:
    -   Navigate to "APIs & Services" > "OAuth consent screen".
    -   Choose "External" for the User Type.
    -   Fill in the required application details (app name, user support email, developer contact information).
    -   You can skip the "Scopes" section for now.
    -   Add your email to the "Test users" section during development.

4.  **Create OAuth 2.0 Client ID**:
    -   Navigate to "APIs & Services" > "Credentials".
    -   Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
    -   Select "Web application" as the application type.
    -   Under "Authorized redirect URIs", you **must** add the callback URLs for all your environments. The path is always `/api/auth/callback/google`.
        -   **Local Development**: `http://localhost:3000/api/auth/callback/google`
        -   **Vercel**: `https://tune-trace-rubp.vercel.app/api/auth/callback/google`
        -   **Render**: `https://tunetrace.onrender.com/api/auth/callback/google`

5.  **Get Credentials**:
    -   After creating the client ID, you will be given a **Client ID** and a **Client Secret**. These are the values you will use for the environment variables.

## Environment Variables

Create a `.env.local` file in the project root and add the following variables. You will also need to set these in your deployment environments (Vercel, Render, etc.).

```
# From Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# A random string used to hash tokens. Generate with `openssl rand -base64 32`
NEXTAUTH_SECRET=your-secret-key

# The canonical URL of your application for the environment
NEXTAUTH_URL=http://localhost:3000
```

**Note**: The `NEXTAUTH_URL` must be set to the correct URL for each respective environment.
