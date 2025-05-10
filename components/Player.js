'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

const Footer = ({
  selectedSongFile,
  songTitle = 'Unknown Title',
  artist = 'Unknown Artist',
  coverImage,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [toast, setToast] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songData, setSongData] = useState({
    selectedSongFile,
    songTitle,
    artist,
    coverImage,
  });
  const [songList, setSongList] = useState([]);
  const audioRef = useRef(null);
  const hasEndedRef = useRef(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 1000);
  };

  useEffect(() => {
    const fetchSongList = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_SONGLIST_API);
        const data = await response.json();
        setSongList(data.songs || []);
      } catch (error) {
        console.error('Error fetching song list:', error);
      }
    };

    fetchSongList();
  }, []);

  useEffect(() => {
    if (selectedSongFile) {
      const history = JSON.parse(localStorage.getItem('songHistory')) || [];
      const newSong = { selectedSongFile, songTitle, artist, coverImage };
      const isAlreadyInHistory = history.some(
        (item) => item.selectedSongFile === selectedSongFile
      );

      if (!isAlreadyInHistory) {
        const updatedHistory = [...history, newSong];
        localStorage.setItem('songHistory', JSON.stringify(updatedHistory));
        setCurrentSongIndex(updatedHistory.length - 1);
      } else {
        const existingIndex = history.findIndex(
          (item) => item.selectedSongFile === selectedSongFile
        );
        setCurrentSongIndex(existingIndex);
      }

      setSongData(newSong);
    }
  }, [selectedSongFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && songData.selectedSongFile) {
      audio.pause();
      audio.load();
      audio.volume = volume;
      audio.muted = isMuted;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Autoplay error:', err));
    }
    hasEndedRef.current = false;
  }, [songData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(console.error) : audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef.current]);


  useEffect(() => {
    if (
      duration > 0 &&
      currentTime >= duration &&
      !hasEndedRef.current
    ) {
      hasEndedRef.current = true;
      handleNext();
    }
  }, [currentTime, duration]);

  const togglePlayPause = () => {
    if (!songData.selectedSongFile) return;
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value) / 100);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handlePrevious = () => {
    const history = JSON.parse(localStorage.getItem('songHistory')) || [];
    if (currentSongIndex > 0) {
      const previousIndex = currentSongIndex - 1;
      const previousSong = history[previousIndex];
      setSongData(previousSong);
      setCurrentSongIndex(previousIndex);
    } else {
      showToast('No song in the queue');
    }
  };

  const [Songs, setSongs] = useState();
  const [randomDataSongs, setRandomDataSongs] = useState({
    selectedSongFile: "",
    songTitle: "",
    artist: "",
    coverImage: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_SONGLIST_API);
        const data = await res.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching song list:", error);
      }
    };
    fetchData();
  }, []);

  const getRandomSong = (allSongsArray) => {
    const randomIndex = Math.floor(Math.random() * allSongsArray.length);
    const randomSong = allSongsArray[randomIndex];
    const fileParts = randomSong.file.split("/");
    const artist = decodeURIComponent(fileParts[fileParts.length - 2]);

    return {
      selectedSongFile: randomSong.file,
      songTitle: randomSong.name,
      artist: randomSong.artist || artist,
      coverImage: randomSong.cover,
    };
  };

  useEffect(() => {
    if (Songs && Songs.HindiSongs && Songs.EnglishSongs) {
      const allSongsArray = [...Songs.HindiSongs, ...Songs.EnglishSongs];
      const firstRandom = getRandomSong(allSongsArray);
      setRandomDataSongs(firstRandom);
    }
  }, [Songs]);

  const handleNext = () => {
    if (!Songs || !Songs.HindiSongs || !Songs.EnglishSongs) return;
    const allSongsArray = [...Songs.HindiSongs, ...Songs.EnglishSongs];
    setSongData(randomDataSongs);
    const nextRandom = getRandomSong(allSongsArray);
    setRandomDataSongs(nextRandom);
  };

  return (
    <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg z-50">
      <section className="flex flex-col gap-2 px-6 py-3 text-violet-700">
        {/* Seek bar */}
        <section className="flex items-center gap-3 w-full">
          <span className="text-xs w-10 text-black text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-black"
          />
          <span className="text-xs w-10 text-black text-left">
            {formatTime(duration)}
          </span>
        </section>

        {/* Controls */}
        <section className="flex items-center justify-between">
          {/* Song Info */}
          <section className="flex items-center gap-3 overflow-hidden max-w-[40%]">
            <img
              src={songData.coverImage || '/default-cover.png'}
              className="w-10 h-10 object-cover rounded-md shrink-0"
            />
            <section className="overflow-hidden">
              <p className="text-sm font-semibold text-black truncate">
                {songData.songTitle || 'No song in the queue'}
              </p>
              <p className="text-xs text-black font-semibold truncate">
                {songData.artist || 'No song in the queue'}
              </p>
            </section>
          </section>

          {/* Playback */}
          <section className="flex items-center gap-4">
            <button
              className="hover:text-violet-400 transition"
              onClick={handlePrevious}
            >
              <SkipBack className="w-5 h-5 text-black cursor-pointer" />
            </button>
            <button onClick={togglePlayPause} className="hover:text-violet-400 transition">
              {isPlaying ? (
                <Pause className="w-7 h-7 text-black cursor-pointer" />
              ) : (
                <Play className="w-7 h-7 text-black cursor-pointer" />
              )}
            </button>
            <button className="hover:text-violet-400 transition" onClick={handleNext}>
              <SkipForward className="w-5 h-5 text-black cursor-pointer" />
            </button>
          </section>

          {/* Volume */}
          <section className="flex items-center gap-2">
            <button onClick={toggleMute} className="hover:text-violet-400 transition">
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
              onChange={handleVolumeChange}
              className="w-20 accent-black"
            />
          </section>
        </section>
      </section>

      {/* Toast */}
      {toast && (
        <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 text-white px-6 py-4 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 ease-in-out">
          <div className="text-sm font-medium tracking-wide">{toast}</div>
        </section>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} src={songData.selectedSongFile} />
    </footer>
  );
};

export default Footer;
