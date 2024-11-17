// src/utils/spotify.ts
const SPOTIFY_API = "https://api.spotify.com/v1";

export type SpotifyTrack = {
  item: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
  };
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
  };
};

export async function getCurrentTrack(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API}/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) {
    return null;
  }

  return response.json() as Promise<SpotifyTrack>;
}

export async function getPlaylists(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API}/me/playlists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json() as { items: SpotifyPlaylist[] };
  return data.items;
}

export type SpotifyUserProfile = {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
};

export async function getUserProfile(accessToken: string): Promise<SpotifyUserProfile> {
  const response = await fetch(`${SPOTIFY_API}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json() as Promise<SpotifyUserProfile>;
}