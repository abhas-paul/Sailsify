'use client';
import React, { useState, useEffect } from 'react';
import SearchPlayer from "@/components/SearchPlayer";

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);

        const songlistResponse = await fetch(process.env.NEXT_PUBLIC_SONGLIST_API);
        const playlistResponse = await fetch(process.env.NEXT_PUBLIC_PLAYLIST_API);

        const songlistData = await songlistResponse.json();
        const playlistData = await playlistResponse.json();

        const hindiSongs = songlistData.HindiSongs || [];
        const englishSongs = songlistData.EnglishSongs || [];

        const alanSongs = playlistData.Alan || [];
        const summerHits = playlistData['Summer hits'] || [];
        const arijitSongs = playlistData.arijit || [];
        const brunoSongs = playlistData.Bruno || [];
        const edSheeranSongs = playlistData['Ed Sheeran'] || [];

        const combinedSongs = [
          ...hindiSongs,
          ...englishSongs,
          ...alanSongs,
          ...summerHits,
          ...arijitSongs,
          ...brunoSongs,
          ...edSheeranSongs,
        ];

        const uniqueSongs = combinedSongs.map((song, index) => ({
          ...song,
          key: `song-${song.name}-${song.artist}-${Date.now()}-${Math.random()}`,
        }));

        setAllSongs(uniqueSongs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setSearched(false);
      return;
    }

    const filtered = allSongs.filter((song) =>
      song.name.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setSearched(true);
  }, [query, allSongs]);

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const SkeletonLoader = () => (
    <section className="w-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <section key={`skeleton-${item}`} className="flex items-center p-3 mb-2 bg-gray-100 animate-pulse rounded-lg">
          <section className="w-12 h-12 bg-gray-300 rounded-md mr-4"></section>
          <section className="flex-1">
            <section className="h-4 bg-gray-300 rounded w-3/4 mb-2"></section>
            <section className="h-3 bg-gray-300 rounded w-1/2"></section>
          </section>
          <section className="w-12 h-4 bg-gray-300 rounded"></section>
        </section>
      ))}
    </section>
  );

  const SongCard = ({ song }) => (
    <section
      className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition-all duration-300 cursor-pointer"
      onClick={() => handleSongClick(song)}
    >
      <img
        src={song.cover || '/placeholder.jpg'}
        alt={song.name}
        className="w-12 h-12 rounded-md object-cover mr-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
        }}
      />
      <section className="flex-1">
        <h3 className="font-medium text-gray-800">{song.name}</h3>
        <p className="text-sm text-gray-600">{song.artist}</p>
      </section>
      <span className="text-xs text-gray-500">{song.duration}</span>
    </section>
  );

  return (
    <section className="flex mt-20 mb-30 flex-col items-center w-full max-w-3xl mx-auto px-4">
      <section className="flex items-center justify-center w-full">
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-3 w-full border border-gray-300 rounded-full placeholder:text-purple-700 text-black focus:outline-none focus:ring-2 focus:ring-purple-700 shadow-sm"
        />
      </section>

      <section className="mt-6 w-full">
        {loading ? (
          <SkeletonLoader />
        ) : searched && results.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No matching songs found for "{query}"</p>
        ) : (
          <section className="space-y-2">
            {(searched ? results : allSongs.slice(0, 10)).map((song) => (
              <SongCard key={song.key} song={song} />
            ))}
          </section>
        )}

        {!searched && !loading && (
          <p className="text-sm text-center text-gray-500 mt-4">
            {allSongs.length > 10 ? 'Showing 10 of ' + allSongs.length + ' songs. Type to search more.' : ''}
          </p>
        )}
      </section>
      <SearchPlayer CurrentSong={selectedSong} />
    </section>
  );
};

export default Search;
