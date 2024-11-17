import type { NextAuthConfig } from "next-auth";
import { type DefaultSession } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";

// Define custom session type to include accessToken
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
  }
  interface JWT {
    accessToken?: string;
    error?: string;
  }
}

const scopes = [
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

export const authConfig = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
    }),
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        }
      },
      client: {
        token_endpoint_auth_method: 'client_secret_post'
      }
    }),
    AppleProvider({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
      };
    }
  }
} satisfies NextAuthConfig;