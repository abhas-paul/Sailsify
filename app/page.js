'use client';
import Player from "@/components/Player";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  
  const [HindiSongs, setHindiSongs] = useState([]);
  const [Engsongs, setEngsongs] = useState([]);
  const [PlayingSong, setPlayingSong] = useState();
  const [Songtitle, setSongtitle] = useState();
  const [artist, setartist] = useState();
  const [Cover, setCover] = useState();

  useEffect(() => {
    const localHindi = localStorage.getItem('HindiSongs');
    const localEnglish = localStorage.getItem('EnglishSongs');

    if (localHindi && localEnglish) {
      setHindiSongs(JSON.parse(localHindi));
      setEngsongs(JSON.parse(localEnglish));
    } else {
      async function SongList(SongList_API) {
        try {
          let res = await fetch(SongList_API);
          let data = await res.json();

          if (data.HindiSongs) {
            setHindiSongs(data.HindiSongs);
            localStorage.setItem('HindiSongs', JSON.stringify(data.HindiSongs));
          } else {
            console.log('API response failed for Hindi songs.');
          }

          if (data.EnglishSongs) {
            setEngsongs(data.EnglishSongs);
            localStorage.setItem('EnglishSongs', JSON.stringify(data.EnglishSongs));
          }
        } catch (error) {
          console.log('Error fetching songs:', error);
        }
      }

      SongList(process.env.NEXT_PUBLIC_SONGLIST_API);
    }
  }, []);

  useEffect(() => {
    const phrases = ["Discover", "Play", "Vibe", "Repeat", "Welcome to Sailsify"];
    let index = 0;
    let charIndex = 0;
    const element = document.getElementById("typed-text");

    const type = () => {
      if (!element) return;

      if (charIndex <= phrases[index].length) {
        element.textContent = phrases[index].substring(0, charIndex++);
        setTimeout(type, 100);
      } else {
        setTimeout(() => erase(), 1500);
      }
    };

    const erase = () => {
      if (!element) return;

      if (charIndex >= 0) {
        element.textContent = phrases[index].substring(0, charIndex--);
        setTimeout(erase, 50);
      } else {
        index = (index + 1) % phrases.length;
        setTimeout(type, 300);
      }
    };

    type();
  }, []);

  const playlists = [
    {
      img: "Alan-walker.jpg",
      title: "Walk the Walker Beats",
      artist: "Alan Walker",
    },
    {
      img: "Bruno-Mars.jpg",
      title: "24K Rhythms On Repeat",
      artist: "Bruno Mars",
    },
    {
      img: "Arijit-Singh.jpg",
      title: "Heartfelt Songs On Repeat",
      artist: "Arijit Singh",
    },
    {
      img: "Ed-Sheeran.jpg",
      title: "Chasing The Perfect Son",
      artist: "Ed Sheeran",
    },
    {
      img: "Vibes For Sunny Days.jpeg",
      title: "Vibes For Sunny Days",
      artist: "Various Artists",
    },
  ];


  return (
    <main className="p-4 mt-15">
      {/* Top Discover Music Section */}
      <section
        className="relative rounded-2xl text-white p-6 sm:p-8 mb-6 overflow-hidden"
        style={{
          backgroundImage: "url('/mic.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <section className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 rounded-2xl"></section>

        <section className="relative z-10 flex flex-col gap-4">
          <section className="flex items-center gap-3">
            <section className="bg-white/20 rounded-full p-2 animate-[float_3s_ease-in-out_infinite]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-2v13"></path>
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"></circle>
                <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="none"></circle>
              </svg>
            </section>
            <h1 className="text-3xl sm:text-4xl font-bold whitespace-nowrap overflow-hidden border-r-4 border-white w-fit animate-typeLoop">
              <span className="block" id="typed-text"></span>
            </h1>


          </section>
          <p className="text-base sm:text-lg max-w-xl">
            Listen to your favorite songs and explore new music that matches your taste
          </p>
          <section className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/FindOne"
              className="w-full sm:w-auto bg-white text-purple-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-purple-100 transition text-sm sm:text-base text-center"
            >
              Explore Music →
            </Link>
            <Link
              href="/CreatePlaylist"
              className="w-full sm:w-auto bg-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/40 transition text-sm sm:text-base text-center"
            >
              Create Playlist
            </Link>
          </section>
        </section>
      </section>

      {/* Bottom Three Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* New Releases */}
        <section className="group relative text-white rounded-xl p-6 overflow-hidden h-[10rem]">
          <section
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: "url('/tabla.jpg')" }}
          ></section>
          <section className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 opacity-80"></section>
          <section className="relative z-10">
            <h2 className="text-xl font-bold mb-2">New Releases</h2>
            <p className="text-sm">Check out the freshest tracks released this week</p>
          </section>
        </section>

        {/* Trending Now */}
        <section className="group relative text-white rounded-xl p-6 overflow-hidden h-[10rem]">
          <section
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: "url('/Sing.jpg')" }}
          ></section>
          <section className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 opacity-80"></section>
          <section className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Trending Now</h2>
            <p className="text-sm">The most popular songs people are listening to</p>
          </section>
        </section>

        {/* Mood Boosters */}
        <section className="group relative text-white rounded-xl p-6 overflow-hidden h-[10rem]">
          <section
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: "url('/dance.jpeg')" }}
          ></section>
          <section className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 opacity-80"></section>
          <section className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Mood Boosters</h2>
            <p className="text-sm">Playlists to lift your spirits and energy</p>
          </section>
        </section>
      </section>

      {/* Featured Playlists */}

      <section className="mb-5">
        <h1 className="text-2xl font-black mt-5 mb-5">Featured Playlists</h1>

        <section className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {playlists.map((playlist, index) => {
            const artistSlug = encodeURIComponent(
              playlist.artist.toLowerCase().replace(/\s+/g, '-')
            );

            return (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => {
                  window.location.href = `/${artistSlug}`;
                }}
              >
                <section className="relative min-w-[250px] sm:min-w-[270px] md:min-w-[260px] lg:min-w-[256px] h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Image */}
                  <section className="overflow-hidden h-2/3">
                    <img
                      src={playlist.img}
                      alt={playlist.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </section>

                  {/* Text */}
                  <section className="p-4 text-white">
                    <h2 className="text-xl font-semibold truncate">{playlist.title}</h2>
                    <p className="text-sm text-gray-400 mt-1 truncate">
                      Sung by {playlist.artist}
                    </p>
                  </section>

                  {/* Hover Play Button */}
                  <section className="absolute inset-0 flex items-center justify-center bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white text-black p-4 rounded-full shadow-lg cursor-pointer hover:scale-110 hover:shadow-white/30 transition-transform duration-300">
                      ▶
                    </div>
                  </section>
                </section>
              </div>
            );
          })}
        </section>
      </section>

      {/* Hindi Songs */}

      <section className="mb-5">
        <h2 className="text-2xl font-bold mb-4">Hindi Songs</h2>

        <section className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {HindiSongs.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
              <section
                key={index}
                className="relative min-w-[250px] sm:min-w-[270px] md:min-w-[260px] lg:min-w-[256px] h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl animate-pulse"
              >
                {/* Cover Skeleton */}
                <section className="overflow-hidden h-2/3 bg-gray-700"></section>

                {/* Text Skeleton */}
                <section className="p-4 text-white space-y-2">
                  <div className="h-4 w-3/4 bg-gray-600 rounded shimmer"></div>
                  <div className="h-3 w-1/2 bg-gray-600 rounded shimmer"></div>
                  <div className="h-3 w-2/3 bg-gray-600 rounded shimmer"></div>
                </section>

                {/* Play Button Skeleton */}
                <section className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-gray-500 rounded-full shimmer"></div>
                </section>
              </section>
            ))
            : HindiSongs.map((song, index) => (
              <section
                key={index}
                className="group relative min-w-[250px] sm:min-w-[270px] md:min-w-[260px] lg:min-w-[256px] h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Cover Image */}
                <section className="overflow-hidden h-2/3">
                  <img
                    src={song.cover}
                    alt={song.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </section>

                {/* Song Info */}
                <section className="p-4 text-white">
                  <h2 className="text-xl font-semibold truncate">{song.name}</h2>
                  <p className="text-sm text-gray-400 mt-1 truncate">Duration: {song.duration}</p>
                  <p className="text-sm text-gray-400 mt-1 truncate">Sung by {song.artist}</p>
                </section>

                {/* Play Button */}
                <section className="absolute inset-0 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-40 transition duration-300">
                  <button
                    onClick={() => {
                      setPlayingSong(song.file);
                      setSongtitle(song.name);
                      setartist(song.artist);
                      setCover(song.cover);
                    }}
                    className="bg-white text-black p-4 rounded-full shadow-lg cursor-pointer hover:scale-110 hover:shadow-white/50 transition-all duration-300"
                  >
                    ▶
                  </button>
                </section>
              </section>
            ))}
        </section>
      </section>


      {/* English Songs */}

      <section className="mb-5">
        <h2 className="text-2xl font-bold mb-4">English Songs</h2>

        <section className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {Engsongs.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
              <section
                key={index}
                className="relative min-w-[250px] sm:min-w-[270px] md:min-w-[260px] lg:min-w-[256px] h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl animate-pulse"
              >
                {/* Cover Skeleton */}
                <section className="overflow-hidden h-2/3 bg-gray-700"></section>

                {/* Text Skeleton */}
                <section className="p-4 text-white space-y-2">
                  <div className="h-4 w-3/4 bg-gray-600 rounded shimmer"></div>
                  <div className="h-3 w-1/2 bg-gray-600 rounded shimmer"></div>
                  <div className="h-3 w-2/3 bg-gray-600 rounded shimmer"></div>
                </section>

                {/* Play Button Skeleton */}
                <section className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-gray-500 rounded-full shimmer"></div>
                </section>
              </section>
            ))
            : Engsongs.map((song, index) => (
              <section
                key={index}
                className="group relative min-w-[250px] sm:min-w-[270px] md:min-w-[260px] lg:min-w-[256px] h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Cover Image */}
                <section className="overflow-hidden h-2/3">
                  <img
                    src={song.cover}
                    alt={song.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </section>

                {/* Song Info */}
                <section className="p-4 text-white">
                  <h2 className="text-xl font-semibold truncate">{song.name}</h2>
                  <p className="text-sm text-gray-400 mt-1 truncate">Duration: {song.duration}</p>
                  <p className="text-sm text-gray-400 mt-1 truncate">Sung by {song.artist}</p>
                </section>

                {/* Play Button */}
                <section className="absolute inset-0 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-40 transition duration-300">
                  <button
                    onClick={() => {
                      setPlayingSong(song.file);
                      setSongtitle(song.name);
                      setartist(song.artist);
                      setCover(song.cover);
                    }}
                    className="bg-white text-black p-4 rounded-full shadow-lg cursor-pointer hover:scale-110 hover:shadow-white/50 transition-all duration-300"
                  >
                    ▶
                  </button>
                </section>
              </section>
            ))}
        </section>
      </section>

      <footer className="bg-[#172030] w-full rounded-2xl p-6 mb-20 text-white space-y-4">
        {/* Heading */}
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          <h1 className="text-2xl font-bold">Message from the Admin</h1>
        </div>

        {/* Introduction */}
        <p className="text-sm">
          Hey there! 👋 Thanks for checking out my music app. This is a personal project built to showcase my development skills — working with custom APIs, and handling real-time data.
        </p>

        {/* Custom API Section */}
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 mt-1 text-purple-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 20c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9z" />
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <p className="text-sm">
            The app uses a <strong>custom-built API</strong> that pulls song metadata, thumbnails, and other assets from YouTube and similar public sources to enhance the music browsing experience.
          </p>
        </div>

        {/* Disclaimer Section */}
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 mt-1 text-red-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm1 18h-2v-2h2v2zm0-4h-2V6h2v8z" />
          </svg>
          <p className="text-sm">
            <strong>Disclaimer:</strong> I do <u>not</u> host or own any of the media content shown here. All rights and ownership belong to the original creators. This app is strictly for <em>educational and portfolio</em> use — no commercial intent involved.
          </p>
        </div>

        {/* Closing */}
        <p className="text-sm">
          This app is a creative expression of what I can build. Hope you enjoy exploring it as much as I enjoyed building it! 🎧
        </p>

        <p className="text-xs text-gray-400 text-right">— Abhas Paul</p>
      </footer>


      {/* Player */}
      <Player selectedSongFile={PlayingSong} songTitle={Songtitle} artist={artist} coverImage={Cover} />
    </main>
  );
}