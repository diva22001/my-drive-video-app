import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import VideoCard from '../components/VideoCard';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Cek tema dari localStorage saat mount
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
    
    loadVideos();
    
    // Event listener untuk infinite scroll
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reset dan load ulang saat search berubah
    setVideos([]);
    setPage(1);
    setHasMore(true);
    loadVideos(true);
  }, [search]);

  const loadVideos = async (reset = false) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get('/api/videos', {
        params: { page, search }
      });
      
      setVideos(prev => reset ? data.videos : [...prev, ...data.videos]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      loadVideos();
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        <Head>
          <title>My Drive Videos</title>
          <meta name="description" content="Browse your Google Drive videos" />
        </Head>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Drive Videos</h1>
            <ThemeToggle darkMode={darkMode} toggle={toggleDarkMode} />
          </div>

          <input
            type="text"
            placeholder="Search videos..."
            className="w-full max-w-md p-3 mb-6 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} darkMode={darkMode} />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!hasMore && videos.length > 0 && (
            <p className="text-center my-8 text-gray-500 dark:text-gray-400">
              No more videos to load
            </p>
          )}
        </div>
      </div>
    </div>
  );
}