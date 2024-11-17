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
            getCurrentTrack(session.user.accessToken),
            getPlaylists(session.user.accessToken),
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Sign in to Spotify T3
          </h1>

          {/* Spotify Button */}
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#1DB954] px-6 py-3 font-semibold text-white transition-all hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:ring-offset-2"
            onClick={() => void signIn("spotify")}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Sign in with Spotify
          </button>

          {/* Discord Button */}
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white transition-all hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
            onClick={() => void signIn("discord")}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Sign in with Discord
          </button>

          {/* Microsoft Button */}
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#2F2F2F] px-6 py-3 font-semibold text-white transition-all hover:bg-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#2F2F2F] focus:ring-offset-2"
            onClick={() =>
              void signIn("azure-ad", {
                callbackUrl: window.location.origin,
                redirect: true,
              })
            }
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 23 23">
              <path d="M11.4 24H0l11.4-11.4L24 24zm0-24L0 11.4V0h11.4L24 12.6V0z" />
            </svg>
            Sign in with Microsoft
          </button>

          {/* Apple Button */}
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            onClick={() => void signIn("apple")}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Sign in with Apple
          </button>
        </div>
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
