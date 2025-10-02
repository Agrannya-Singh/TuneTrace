import NextAuth from "next-auth";
import Google from "next-auth/providers/google"; // Updated for v5

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string, // Or use AUTH_GOOGLE_ID for v5 auto-inference
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Or use AUTH_GOOGLE_SECRET
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.force-ssl",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Or AUTH_SECRET for v5
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
  pages: {
    error: '/auth/error', // Fixed to a client-side route
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };