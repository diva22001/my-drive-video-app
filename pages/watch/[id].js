import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';

export default function WatchVideo() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        <Head>
          <title>Video Player</title>
        </Head>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" passHref>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Back to Videos
              </button>
            </Link>
            <ThemeToggle darkMode={darkMode} toggle={toggleDarkMode} />
          </div>

          <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
            <iframe
              src={`https://drive.google.com/file/d/${id}/preview`}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
