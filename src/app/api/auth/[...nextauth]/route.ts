import NextAuth, { SessionStrategy } from "next-auth"
import { getToken } from "next-auth/jwt";
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signOut } from "next-auth/react";
import { NextRequest } from "next/server";


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser } 
      : {token: any, user?: any, account?: any, profile?: any, isNewUser?: boolean}) {
      // account is only available the first time a user signs in
        if(account) {
        token.provider = account?.provider; // provider name
        token.accessToken = account?.accessToken;

                console.log("JWT access token: ", account.access_token);
        // Prefer providerAccountId from the Account object (set by OAuth providers).
        // Fallbacks: OAuth profile id, user.id from credentials authorize(), or token.sub.
        if (account?.providerAccountId) {
          token.providerAccountId = account?.providerAccountId;
        } else if (profile?.id) {
          token.providerAccountId = profile.id;
        } else if (user?.id) {
          token.providerAccountId = user.id;
        } else {
          token.providerAccountId = token.sub || null;
        }
      }

    if (account) {
      console.log("Profile info in JWT callback:", profile);

    try {
      const response = await fetch(
        `${process.env.TALK_SERVER_URL}/auth/social`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: account.provider,
            providerId: account.providerAccountId,
            email: profile?.email ,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("SPRING ERROR:", text);
        throw new Error("Spring auth failed");
      }

      const text = await response.text();

      if (!text) {
        throw new Error("Spring returned empty response");
      }

      const data = JSON.parse(text);

      token.springAccessToken = data.token;

    } catch (err) {
      console.error("JWT CALLBACK ERROR:", err);
      throw err; // important so NextAuth shows error
    }
  }

    // 🔥 Check expiration on every request
  if (token.springExpiresAt && Date.now() > token.springExpiresAt) {
    console.log("Spring token expired — deleting");
    delete token.springAccessToken;
    delete token.springExpiresAt;
  }
  
  return token;
    },
    async session({ session, token } : {session: any, token: any}) {
      // Pass the provider name from the token to the session object
      if (token.provider) {
        session.user.provider = token.provider;
        session.user.providerAccountId = token.providerAccountId;
      }

      session.springAccessToken = token.springAccessToken;

      console.log("session: ", session);

      return session;
    },

  },

  session: {
    strategy: "jwt" as SessionStrategy,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  encryption: false,
  // Enable debug with NEXTAUTH_DEBUG=true when troubleshooting
  debug: process.env.NEXTAUTH_DEBUG === "true",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }