// File: src/app/page.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "~/app/_components/ui/card";
import type { SpotifyPlaylist, SpotifyTrack } from "~/utils/spotify";
import { getCurrentTrack, getPlaylists } from "~/utils/spotify";

export default function Home() {
  const { data: session } = useSession();
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchData = async () => {
        try {
          const [trackData, playlistData] = await Promise.all([
            getCurrentTrack(session.user.accessToken!),
            getPlaylists(session.user.accessToken!),
          ]);

          setCurrentTrack(trackData);
          setPlaylists(playlistData);
        } catch (error) {
          console.error("Error fetching Spotify data:", error);
        }
      };

      void fetchData();
      const interval = setInterval(() => {
        void fetchData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <button
          className="rounded-lg bg-[#1DB954] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1ed760]"
          onClick={() => void signIn("spotify")}
        >
          Sign in with Spotify
        </button>
        <button
          className="rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4752C4]"
          onClick={() => void signIn("discord")}
        >
          Sign in with Discord
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Spotify T3 App</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{session.user?.email}</span>
            <button
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-600"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {currentTrack && (
          <Card className="mb-8 border-gray-700 bg-gray-800/50">
            <div className="p-4">
              <h2 className="mb-4 text-xl font-semibold">Now Playing</h2>
              <div className="flex items-center space-x-4">
                {currentTrack.item?.album?.images[0] && (
                  <Image
                    src={currentTrack.item.album.images[0].url}
                    alt="Album Art"
                    width={128}
                    height={128}
                    className="rounded-lg"
                  />
                )}
                <div>
                  <p className="text-lg font-medium">
                    {currentTrack.item?.name}
                  </p>
                  <p className="text-gray-400">
                    {currentTrack.item?.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Playlists</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="border-gray-700 bg-gray-800/50 transition-transform hover:scale-105"
              >
                <div className="p-4">
                  {playlist.images[0] && (
                    <Image
                      src={playlist.images[0].url}
                      alt="Playlist Cover"
                      width={192}
                      height={192}
                      className="mb-2 h-48 w-full rounded-lg object-cover"
                    />
                  )}
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-sm text-gray-400">
                    {playlist.tracks.total} tracks
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}