// File: src/server/auth/config.ts
import { type NextAuthConfig } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
// File: scripts/generate-apple-secret.mts
import jwt from "jsonwebtoken";



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
      tenantId: process.env.AZURE_AD_TENANT_ID,
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

  jwt: {
    // Use a synchronous secret for development
    secret: process.env.NEXTAUTH_SECRET,
    // For production, use encryption keys
    encode: async ({ secret, token }) => {
      if (!token) return "";
      return jwt.sign(token, secret);
    },
    decode: async ({ secret, token }) => {
      if (!token) return null;
      try {
        return jwt.verify(token, secret); // Error: 
        /*
        "secret": No overload matches this call.
        The last overload gave the following error.
        Argument of type 'string | string[]' is not assignable to parameter of type 'Buffer<ArrayBufferLike> | Secret | JsonWebKeyInput | PublicKeyInput | GetPublicKeyOrSecret'.
        Type 'string[]' is not assignable to type 'Buffer<ArrayBufferLike> | Secret | JsonWebKeyInput | PublicKeyInput | GetPublicKeyOrSecret'.
        Type 'string[]' is missing the following properties from type 'Buffer<ArrayBufferLike>': subarray, write, toJSON, equals, and 73 more.ts(2769)
         */
      } catch (error) {
        return null;
      }
    }

  },
  callbacks: {
    // Simplified callback to handle just what we need
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken; // Error: Property 'accessToken' does not exist on type '{ user: AdapterUser; } & AdapterSession & Session'.ts(2339)
      }
      return session;
    }
  }
} satisfies NextAuthConfig;