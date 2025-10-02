import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent", // Add prompt and access_type back
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.force-ssl",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  // Add pages configuration for error handling
  pages: {
    error: '/api/auth/error', // Specify the error page route
  },
});
// Use NextAuth with the defined options to create handlers
const handler = NextAuth(authOptions);

// Correct export for Next.js App Router
export { handler as GET, handler as POST };