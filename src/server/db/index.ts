// File: src/server/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";


/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn; // env.NODE_ENV Errpr: Property 'NODE_ENV' does not exist on type 'Readonly<{ SPOTIFY_CLIENT_ID: string; SPOTIFY_CLIENT_SECRET: string; NEXTAUTH_URL: string; NEXTAUTH_SECRET: string; DATABASE_URL: string; }>'.ts(2339) 

export const db = drizzle(conn, { schema });
