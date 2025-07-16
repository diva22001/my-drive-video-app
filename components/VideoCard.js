import Link from 'next/link';

export default function VideoCard({ video, darkMode }) {
  const formatDuration = (millis) => {
    if (!millis) return 'Unknown';
    const seconds = Math.floor(millis / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  return (
    <Link href={`/watch/${video.id}`} passHref>
      <div className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <img
          src={video.thumbnailLink || '/placeholder.jpg'}
          alt={video.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className={`font-bold truncate ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {video.name}
          </h3>
          <p className="text-gray-500">
            {formatDuration(video.videoMediaMetadata?.durationMillis)}
          </p>
        </div>
      </div>
    </Link>
  );
}