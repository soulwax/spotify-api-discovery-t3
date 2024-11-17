// File: scripts/generate-apple-secret.mts
import jwt from "jsonwebtoken";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
const keyPath = join(__dirname, `../keys/AuthKey_${keyId}.p8`);

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
  const token = jwt.sign({}, key, options);
  console.log("Your client secret (valid for 180 days):");
  console.log(token);
} catch (error) {
  console.error("Error generating token:", error);
  process.exit(1);
}
