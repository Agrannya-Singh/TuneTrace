# Authentication Setup (Firebase with Google)

This document outlines the authentication setup for the application, which uses Firebase to handle OAuth with Google as the identity provider.

## Overview

- **Framework**: Next.js
- **Service**: Firebase Authentication
- **Provider**: Google

The authentication flow is managed using the Firebase SDK. The core configuration is located in `src/lib/firebase.ts`, which initializes the Firebase app.

The application is wrapped with an `AuthProvider` in `src/app/context/providers.tsx`, which uses `src/app/context/AuthContext.tsx` to make the user's authentication state available globally. UI components like `src/components/auth-button.tsx` use the `useAuth` hook to display the user's authentication state and provide sign-in/sign-out functionality.

## Firebase Console Setup

To enable Google login, you must configure Firebase Authentication in the Firebase Console.

1.  **Create a new Firebase Project** (or use an existing one) at [console.firebase.google.com](https://console.firebase.google.com/).

2.  **Add a Web App**: 
    - In your project, click the web icon (`</>`) to add a new web application.
    - Register your app and copy the `firebaseConfig` object. This will be used in your environment variables.

3.  **Enable Google Sign-In**:
    -   Navigate to "Authentication" > "Sign-in method".
    -   Select "Google" from the list of providers and enable it.
    -   Provide a project support email.

4.  **Add Authorized Domains**:
    -   Under the "Authentication" > "Settings" > "Authorized domains" tab, ensure your deployment domains are listed (e.g., `localhost`, your Vercel URL, your Render URL).

## Environment Variables

Create a `.env.local` file in the project root and add the following variables using the values from your Firebase project's web app configuration.

```
# From Firebase Console > Project Settings > Your Apps > Web App
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Note**: These variables must be prefixed with `NEXT_PUBLIC_` to be accessible on the client side in Next.js.
