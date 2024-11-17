# Spotify API Discovery (T3 Stack)

A T3 web """app""" that allows me to discover different auth strategies, SPA, and API integrations with Spotify. Not more not less.
Apple doesn't work yet because it's a piece of shit.

## Features

- Authentication via multiple providers [Spotify, Discord, Azure AD, Apple]
- Spotify API integration with extensive scope permissions
- Advanced playback controls and playlist management (not integrated)
- Type-safe API calls with tRPC
- Modern UI with Tailwind CSS (not a feature)
- Lots of .ENV variables lol have fun setting this shit up.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5 Beta
- **Database**: PostgreSQL with Drizzle ORM (not used meaningfully)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables (required):

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- Additional provider secrets as needed

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3310`.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm typecheck` - Type checking
- `pnpm db:generate` - Generate database schemas
