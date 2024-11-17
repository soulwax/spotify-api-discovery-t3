// File: src/server/auth/config.ts
import { type NextAuthConfig } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
// File: scripts/generate-apple-secret.mts
import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

interface JWT {
  token_type?: string;
  expires_in?: number;
  ext_expires_in?: number;
  access_token?: string;
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

export const getAppleToken = async () => {
  // Load environment variables
  config();
  // Validate environment variables
  if (!process.env.AUTH_APPLE_TEAM_ID)
    throw new Error("AUTH_APPLE_TEAM_ID is not defined");
  if (!process.env.AUTH_APPLE_ID) throw new Error("AUTH_APPLE_ID is not defined");
  if (!process.env.AUTH_APPLE_KEY_ID)
    throw new Error("AUTH_APPLE_KEY_ID is not defined");

  // Configuration values from environment
  const teamId = process.env.AUTH_APPLE_TEAM_ID;
  const clientId = process.env.AUTH_APPLE_ID;
  const keyId = process.env.AUTH_APPLE_KEY_ID;
  const keyPath = join(__dirname, `../../../keys/AuthKey_${keyId}.p8`);

  // Verify key file exists
  if (!existsSync(keyPath)) {
    throw new Error(`Key file not found at: ${keyPath}`);
  }

  // Read the private key
  const key = readFileSync(keyPath);

  // JWT signing options
  const options = {
    algorithm: "ES256" as const,
    expiresIn: "180d",
    audience: "https://appleid.apple.com",
    issuer: teamId,
    subject: clientId,
    keyid: keyId,
  };

  try {
    return jwt.sign({}, key, options);
  } catch (error) {
    console.error("Error generating token:", error);
    process.exit(1);
  }

};

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

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
          scope: "openid profile email User.Read"
        }
      }
    }),
    AppleProvider({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: await getAppleToken(),
    }),
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        token.token_type = account.token_type;
        token.expires_in = account.expires_in;
        token.ext_expires_in = account.ext_expires_in;
        token.access_token = account.access_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.accessToken = token.access_token;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;