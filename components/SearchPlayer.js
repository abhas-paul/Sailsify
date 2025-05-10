'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const Footer = ({ CurrentSong }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState(CurrentSong);

  useEffect(() => {
    setCurrentSong(CurrentSong);
  }, [CurrentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.file) return;

    if (!currentSong.file.startsWith('http')) {
      console.warn('⚠️ Invalid song file URL:', currentSong.file);
      setIsPlaying(false);
      return;
    }

    audio.src = currentSong.file;
    audio.load();

    setTimeout(() => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('❌ Error playing audio:', err);
          setIsPlaying(false);
        });
    }, 100);
  }, [currentSong]); 

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => console.error('Error resuming audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  useEffect(() => {
    if (currentTime === duration) {
      const audio = audioRef.current;
      if (audio) audio.play();
    } else {
      return;
    }
  }, [currentTime, duration]);

  return (
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
  );
};

export default Footer;
