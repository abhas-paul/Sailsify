'use client';

import React, { useState, useEffect } from 'react';

const Page = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ApiRes, setApiRes] = useState();
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    
    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    if (!title.trim() || selectedSongs.length === 0) return;
    
    // Calculate total duration of the playlist
    const totalDuration = calculateTotalDuration(selectedSongs);
    
    // Create playlist object
    const newPlaylist = {
      id: generateObjectId(),
      title: title,
      description: description,
      songs: selectedSongs,
      coverImage: coverImagePreview,
      totalDuration: totalDuration,
      createdAt: new Date().toISOString()
    };
    
    // Save to local storage
    savePlaylistToLocalStorage(newPlaylist);
    
    // Show toast and redirect to library page
    showToast(`Playlist "${title}" created successfully!`);
    
    // Redirect after a short delay to allow the toast to be seen
    setTimeout(() => {
      window.location.href = '/library';
    }, 1500);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedSongs([]);
    setCoverImage(null);
    setCoverImagePreview(null);
    setFormSubmitted(false);
  };
  
  const calculateTotalDuration = (songs) => {
    // Sum up durations of all songs
    let totalSeconds = 0;
    
    songs.forEach(song => {
      const durationParts = song.duration.split(':');
      const minutes = parseInt(durationParts[0], 10);
      const seconds = parseInt(durationParts[1], 10);
      totalSeconds += (minutes * 60) + seconds;
    });
    
    // Convert back to mm:ss format
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const savePlaylistToLocalStorage = (playlist) => {
    try {
      // Get existing playlists from local storage
      const existingPlaylistsJSON = localStorage.getItem('playlists');
      const existingPlaylists = existingPlaylistsJSON ? JSON.parse(existingPlaylistsJSON) : [];
      
      // Add new playlist
      existingPlaylists.push(playlist);
      
      // Save back to local storage
      localStorage.setItem('playlists', JSON.stringify(existingPlaylists));
    } catch (error) {
      console.error("Error saving playlist to local storage:", error);
      alert("There was an error saving your playlist. Please try again.");
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCoverImage(file);
    
    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    async function ApiData() {
      try {
        let res1 = await fetch(process.env.NEXT_PUBLIC_SONGLIST_API)
        let res2 = await fetch(process.env.NEXT_PUBLIC_PLAYLIST_API)
        let data1 = await res1.json()
        let data2 = await res2.json()

        let EnglishSongs = data1.EnglishSongs;
        let HindiSongs = data1.HindiSongs;
        let AlanSongs = data2.Alan;
        let BrunoSongs = data2.Bruno;
        let EdSheeranSongs = data2["Ed Sheeran"];
        let SummerhitsSongs = data2['Summer hits'];
        let arijitSongs = data2.arijit;

        let data = initializeSongsWithObjectId(
          EnglishSongs,
          HindiSongs,
          AlanSongs,
          BrunoSongs,
          EdSheeranSongs,
          SummerhitsSongs,
          arijitSongs
        );

        setApiRes(data)
      } catch (error) {
        console.log(error);
      }
    }

    ApiData();
  }, []);

  function generateObjectId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = Math.random().toString(16).substring(2, 14).padEnd(12, '0');
    return (timestamp + random).substring(0, 24);
  }

  function initializeSongsWithObjectId(...songArrays) {
    return songArrays.flat().map(song => ({
      ...song,
      _id: generateObjectId(),
    }));
  }

  return (
    <section className="max-w-md mt-20 mx-auto p-6 border rounded-lg shadow-lg bg-white relative">
      {/* Toast notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
          {toast.message}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">Create Playlist</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <section>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Playlist Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter playlist title"
          />
          {formSubmitted && !title.trim() && (
            <p className="text-sm text-red-500 mt-1">Please enter a playlist title</p>
          )}
        </section>

        <section>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter a description for your playlist"
          />
        </section>

        <section className="max-h-72 overflow-y-auto border rounded-md bg-gray-50 p-4 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Select Songs</span>
            <span className="text-sm text-purple-600">
              {selectedSongs.length} songs selected
              {selectedSongs.length > 0 && ` (${calculateTotalDuration(selectedSongs)})`}
            </span>
          </div>
          
          {ApiRes && ApiRes.length > 0 ? (
            ApiRes.map((song) => (
              <div key={song._id} className="flex items-center gap-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedSongs.some(s => s._id === song._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSongs(prev => [...prev, song]);
                    } else {
                      setSelectedSongs(prev => prev.filter(s => s._id !== song._id));
                    }
                  }}
                />
                <img src={song.cover} alt={song.name} className="w-10 h-10 object-cover rounded" />
                <div>
                  <p className="font-medium text-gray-800">{song.name}</p>
                  <p className="text-xs text-gray-500">{song.artist} • {song.duration}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-400">Loading songs...</p>
          )}
          
          {formSubmitted && selectedSongs.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one song</p>
          )}
        </section>


        <section>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Playlist Cover</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            className="w-full mt-1 p-2 border rounded-md"
            onChange={handleCoverImageChange}
          />
          {coverImagePreview && (
            <div className="mt-2">
              <img 
                src={coverImagePreview} 
                alt="Cover preview" 
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
          )}
        </section>

        <section className="text-center mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-purple-700 text-white rounded-md font-medium hover:bg-purple-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Playlist
          </button>
        </section>
      </form>
    </section>
  );
};

export default Page;