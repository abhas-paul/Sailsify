'use client';
import React, { useEffect, useState } from 'react';
import { Clock, Play } from 'lucide-react';
import FeaturedPlayer from '@/components/FeaturedPlayer';

const Page = () => {
  const [songs, setSongs] = useState([]);
  const [duration, setDuration] = useState('');
  const [currentSong, setCurrentSong] = useState({
    cover: '',
    name: '',
    artist: '',
    duration: '',
    track: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedSongs = localStorage.getItem('alanSongs');

      const getTotalDuration = (songsList) => {
        let totalSeconds = 0;

        songsList.forEach((song) => {
          if (song.duration) {
            const [minutes, seconds] = song.duration.split(':').map(Number);
            totalSeconds += minutes * 60 + seconds;
          }
        });

        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

        setDuration(`${totalMinutes}:${paddedSeconds}`);
      };

      if (storedSongs) {
        const parsedSongs = JSON.parse(storedSongs);
        setSongs(parsedSongs);
        getTotalDuration(parsedSongs);
      } else {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_PLAYLIST_API);
          if (!res.ok) return;

          const data = await res.json();

          // Get only Alan songs
          const alanSongs = data?.Alan || [];

          localStorage.setItem('alanSongs', JSON.stringify(alanSongs));
          setSongs(alanSongs);
          getTotalDuration(alanSongs);
        } catch (error) {
          console.error('Failed to fetch songs:', error);
        }
      }
    };

    fetchData();
  }, []);

  const manageClick = (song) => {
    setCurrentSong({
      cover: song.cover || '',
      name: song.name || 'Unknown Title',
      artist: song.artist || 'Unknown Artist',
      duration: song.duration || '--:--',
      track: song.file || '',
    });
  };


  return (
    <section className="min-h-screen pb-25 bg-gradient-to-b mt-15 from-indigo-900 via-purple-800 to-blue-900 text-white">
      {/* Header */}
      <section className="flex flex-col md:flex-row p-6 md:p-8 gap-6 items-center md:items-end">
        <section className="w-40 h-40 md:w-48 md:h-48 bg-gray-800 shadow-lg rounded-md overflow-hidden">
          <img
            src="https://i1.sndcdn.com/artworks-000355470678-dkpit0-t500x500.jpg"
            alt="Alan Walker"
            className="w-full h-full object-cover"
          />
        </section>

        <section className="text-center md:text-left">
          <p className="text-sm text-blue-300 font-semibold">Public Playlist</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold my-2 md:my-4">Alan Walker</h1>
          <section className="flex flex-wrap justify-center md:justify-start items-center gap-1 text-sm text-blue-200">
            <span>{songs.length} songs</span>
            <span className="mx-1 text-gray-400">•</span>
            <span>Total Duration: {duration}</span>
          </section>
        </section>
      </section>

      {/* Table Header */}
      <section className="px-4 md:px-8 border-b border-indigo-700/50">
        <section className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-2 md:px-4 py-2 text-sm">
          <span className="text-blue-300">#</span>
          <span className="text-blue-200">Title</span>
          <span className="text-blue-200 pl-5">Artist</span>
          <span className="flex justify-end text-blue-200">
            <Clock size={16} />
          </span>
        </section>
      </section>

      {/* Songs List or Skeleton Loader */}
      <section className="px-4 md:px-8">
        {songs.length === 0 ? (
          Array.from({ length: 7 }).map((_, i) => (
            <section
              key={i}
              className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-2 md:px-4 py-3 bg-slate-800 animate-pulse rounded-md mb-2"
            >
              <section className="flex items-center">
                <section className="w-6 h-4 bg-slate-700 rounded-sm"></section>
              </section>
              <section className="flex items-center gap-3 overflow-hidden">
                <section className="w-10 h-10 bg-slate-700 rounded-sm flex-shrink-0"></section>
                <section className="flex-1">
                  <section className="w-32 h-4 bg-slate-700 rounded"></section>
                </section>
              </section>
              <section className="flex items-center">
                <section className="w-24 h-4 bg-slate-700 rounded"></section>
              </section>
              <section className="flex items-center justify-end">
                <section className="w-12 h-4 bg-slate-700 rounded"></section>
              </section>
            </section>
          ))
        ) : (
          songs.map((song, index) => (
            <section
              key={song._id || index}
              onClick={() => manageClick(song)}
              className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-2 md:px-4 py-3 cursor-pointer hover:bg-white/10 rounded-md group transition-all duration-200"
            >
              <section className="flex items-center text-gray-400 group-hover:text-blue-300">
                {index + 1}
              </section>

              <section className="flex items-center gap-3 overflow-hidden">
                <section className="relative w-10 h-10 bg-gray-800 flex-shrink-0 rounded-sm overflow-hidden shadow-md">
                  {song.cover && (
                    <img
                      src={song.cover}
                      alt={song.name}
                      className="w-full h-full object-center"
                    />
                  )}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition">
                    <Play size={18} className="text-white" />
                  </button>
                </section>

                <section className="truncate">
                  <section className="font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                    {song.name || 'Unknown Title'}
                  </section>
                </section>
              </section>

              <section className="flex items-center text-gray-300 truncate">
                {song.artist || 'Alan Walker'}
              </section>

              <section className="flex items-center justify-end text-gray-300">
                {song.duration || '—'}
              </section>
            </section>
          ))
        )}
      </section>

      <FeaturedPlayer CurrentSong={currentSong} />
    </section>
  );
};

export default Page;
