'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const Page = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [showPlaylistSongs, setShowPlaylistSongs] = useState(false);
  
  // Player states
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const fetchPlaylistsTimeout = setTimeout(() => {
      try {
        const storedPlaylists = localStorage.getItem('playlists');
        if (storedPlaylists) {
          setPlaylists(JSON.parse(storedPlaylists));
        }
      } catch (error) {
        showToast("Error loading playlists", "error");
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(fetchPlaylistsTimeout);
  }, []);

  useEffect(() => {
    if (activePlaylist && activePlaylist.songs.length > 0) {
      setCurrentSongIndex(0);
      setCurrentSong(activePlaylist.songs[0]);
    } else {
      setCurrentSong(null);
    }
  }, [activePlaylist]);

  useEffect(() => {
    if (!activePlaylist) return;
    
    if (currentSongIndex >= 0 && currentSongIndex < activePlaylist.songs.length) {
      setCurrentSong(activePlaylist.songs[currentSongIndex]);
    }
  }, [currentSongIndex, activePlaylist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.file) return;

    audio.src = currentSong.file;
    audio.load();

    if (isPlaying) {
      setTimeout(() => {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error('Error playing audio:', err);
            setIsPlaying(false);
          });
      }, 100);
    }
  }, [currentSong]);

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    return duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('section');
    toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-sm font-medium transition-all duration-500 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 2500);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleDeletePlaylist = (playlistId, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this playlist?")) {
      try {
        const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
        localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
        setPlaylists(updatedPlaylists);

        if (activePlaylist && activePlaylist.id === playlistId) {
          setShowPlaylistSongs(false);
          setActivePlaylist(null);
          setIsPlaying(false);
          setCurrentSong(null);
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }
        showToast("Playlist deleted successfully", "success");
      } catch (error) {
        showToast("Error deleting playlist", "error");
      }
    }
  };

  const handlePlayPlaylist = (playlist) => {
    setActivePlaylist(playlist);
    setShowPlaylistSongs(true);
    setCurrentSongIndex(0);
    if (playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0]);
      setIsPlaying(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaySong = (songIndex) => {
    if (!activePlaylist || !activePlaylist.songs.length) return;
    
    setCurrentSongIndex(songIndex);
    setCurrentSong(activePlaylist.songs[songIndex]);
    setIsPlaying(true);
    
    if (audioRef.current) {
      setTimeout(() => {
        audioRef.current.play()
          .catch(error => console.error('Error playing song:', error));
      }, 100);
    }
  };

  const handleCloseSongsView = () => {
    setShowPlaylistSongs(false);
    setActivePlaylist(null);
    setIsPlaying(false);
    setCurrentSong(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => console.error('Error resuming audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePreviousSong = () => {
    if (!activePlaylist || !activePlaylist.songs.length) return;
    
    const newIndex = currentSongIndex > 0 
      ? currentSongIndex - 1 
      : activePlaylist.songs.length - 1;
    
    setCurrentSongIndex(newIndex);
  };

  const handleNextSong = () => {
    if (!activePlaylist || !activePlaylist.songs.length) return;
    
    const newIndex = currentSongIndex < activePlaylist.songs.length - 1 
      ? currentSongIndex + 1 
      : 0;
    
    setCurrentSongIndex(newIndex);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Auto play next song
      handleNextSong();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, currentSongIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = isMuted;
  }, [isMuted]);

  const renderSkeleton = () => {
    return Array(3).fill(0).map((_, index) => (
      <section key={index} className="w-full bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
        <section className="h-48 bg-gray-200"></section>
        <section className="p-4">
          <section className="h-5 bg-gray-200 rounded mb-3 w-3/4"></section>
          <section className="h-4 bg-gray-200 rounded mb-2 w-1/2"></section>
          <section className="h-4 bg-gray-200 rounded w-1/4"></section>
        </section>
      </section>
    ));
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start mt-20 py-8 px-4 sm:px-6 md:px-10 pb-24">
      <section className="flex flex-col items-center text-center mb-10 mt-4">
        <section className="border-[4px] border-purple-700 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-lg shadow-lg p-5 flex justify-center items-center bg-white hover:scale-105 hover:shadow-xl transition-all mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" color="#d011f7" fill="none">
            <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" stroke="#d011f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </section>
        <h2 className="text-[32px] sm:text-[40px] font-bold text-purple-700">Your Library</h2>
      </section>

      {/* Playlist Songs View */}
      {showPlaylistSongs && activePlaylist && (
        <section className="w-full max-w-4xl mb-10 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
          <section className="flex flex-col md:flex-row">
            <section className="w-full md:w-1/3 bg-purple-50 p-6 flex flex-col items-center">
              <section className="h-40 w-40 overflow-hidden rounded-lg shadow-md mb-4">
                {activePlaylist.coverImage ? (
                  <img src={activePlaylist.coverImage} alt={activePlaylist.title} className="w-full h-full object-cover" />
                ) : (
                  <section className="w-full h-full flex items-center justify-center bg-purple-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </section>
                )}
              </section>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{activePlaylist.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{activePlaylist.songs.length} songs • {formatDuration(activePlaylist.totalDuration)}</p>
              {activePlaylist.description && (
                <p className="text-gray-600 text-sm text-center mt-2">{activePlaylist.description}</p>
              )}
              <button
                onClick={handleCloseSongsView}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Back to Library
              </button>
            </section>

            {/* Songs List */}
            <section className="w-full md:w-2/3 p-4">
              <h4 className="font-medium text-gray-700 mb-4 p-2 border-b">Songs</h4>
              <section className="overflow-y-auto max-h-[500px]">
                {activePlaylist.songs.length > 0 ? (
                  activePlaylist.songs.map((song, index) => (
                    <section 
                      key={song._id} 
                      className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded-md ${currentSongIndex === index && isPlaying ? 'bg-purple-50' : ''}`}
                      onClick={() => handlePlaySong(index)}
                    >
                      <span className="text-gray-400 mr-4 w-6 text-center">{index + 1}</span>
                      <img src={song.cover} alt={song.name} className="w-10 h-10 object-cover rounded mr-3" />
                      <section className="flex-grow">
                        <p className={`font-medium ${currentSongIndex === index ? 'text-purple-700' : 'text-gray-800'}`}>{song.name}</p>
                        <p className="text-xs text-gray-500">{song.artist}</p>
                      </section>
                      <span className="text-gray-400 text-sm">{song.duration}</span>
                    </section>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">This playlist has no songs</p>
                )}
              </section>
            </section>
          </section>
        </section>
      )}

      {/* Playlist Grid */}
      {loading ? (
        <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeleton()}
        </section>
      ) : playlists.length > 0 ? (
        <section className="max-w-4xl w-full">
          <section className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800">Your Playlists ({playlists.length})</h3>
            <Link href="/CreatePlaylist">
              <button className="px-4 py-2 bg-purple-700 cursor-pointer text-white rounded-md hover:bg-purple-800 transition-colors text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Playlist
              </button>
            </Link>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <section key={playlist.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <section className="h-48 bg-gray-100 relative overflow-hidden">
                  {playlist.coverImage ? (
                    <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
                  ) : (
                    <section className="w-full h-full flex items-center justify-center bg-purple-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </section>
                  )}
                  <section className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-medium truncate">{playlist.title}</p>
                  </section>
                </section>

                <section className="p-4">
                  <section className="flex justify-between items-start">
                    <section>
                      <p className="text-gray-500 text-sm mb-1">{playlist.songs.length} songs</p>
                      <p className="text-gray-500 text-sm">Duration: {formatDuration(playlist.totalDuration)}</p>
                    </section>
                    <button
                      onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                      className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </section>
                  {playlist.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{playlist.description}</p>
                  )}
                  <section className="mt-4">
                    <button
                      onClick={() => handlePlayPlaylist(playlist)}
                      className="w-full py-2 bg-purple-700 cursor-pointer text-white rounded-md hover:bg-purple-800 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Play
                    </button>
                  </section>
                </section>
              </section>
            ))}
          </section>
        </section>
      ) : (
        <section className="max-w-4xl w-full bg-gray-50 rounded-lg p-8 text-center shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Library available</h3>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            Your library is empty. Add songs to get started with your collection.
          </p>
          <Link href="/CreatePlaylist">
            <button className="px-8 py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors text-lg font-medium">
              Add Library
            </button>
          </Link>
        </section>
      )}

      {/* Audio Player */}
      {currentSong && (
        <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg z-50">
          <audio ref={audioRef} preload="metadata" />
          <section className="flex flex-col gap-2 px-6 py-3 text-violet-700">
            <section className="flex items-center gap-3 w-full">
              <span className="text-xs w-10 text-black text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                className="w-full accent-black"
                onChange={handleSeek}
              />
              <span className="text-xs w-10 text-black text-left">{formatTime(duration)}</span>
            </section>

            <section className="flex items-center justify-between">
              <section className="flex items-center gap-3 overflow-hidden max-w-[40%]">
                <img
                  src={currentSong?.cover || '/default-cover.png'}
                  className="w-10 h-10 object-cover rounded-md shrink-0"
                  alt={currentSong?.name}
                />
                <section className="overflow-hidden">
                  <p className="text-sm font-semibold text-black truncate">
                    {currentSong?.name || 'No song selected'}
                  </p>
                  <p className="text-xs text-black font-semibold truncate">
                    {currentSong?.artist || 'Unknown artist'}
                  </p>
                </section>
              </section>

              <section className="flex items-center gap-4">
                <button
                  onClick={handlePreviousSong}
                  className="hover:text-violet-400 transition"
                  disabled={!activePlaylist || !activePlaylist.songs.length}
                  aria-label="Previous song"
                >
                  <SkipBack className="w-5 h-5 text-black cursor-pointer" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="hover:text-violet-400 transition"
                  disabled={!currentSong?.file}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-black cursor-pointer" />
                  ) : (
                    <Play className="w-7 h-7 text-black cursor-pointer" />
                  )}
                </button>
                
                <button
                  onClick={handleNextSong}
                  className="hover:text-violet-400 transition"
                  disabled={!activePlaylist || !activePlaylist.songs.length}
                  aria-label="Next song"
                >
                  <SkipForward className="w-5 h-5 text-black cursor-pointer" />
                </button>
              </section>

              <section className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-violet-400 transition"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-black cursor-pointer" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-black cursor-pointer" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(e.target.value / 100)}
                  className="w-20 accent-black"
                  aria-label="Volume control"
                />
              </section>
            </section>
          </section>
        </footer>
      )}
    </main>
  );
};

export default Page;