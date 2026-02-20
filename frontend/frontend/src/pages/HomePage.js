import React, { useEffect, useState } from 'react';
import { useVideos } from '../context/VideoContext';
import VideoCard from '../components/VideoCard';
import { FaSpinner, FaSearch } from 'react-icons/fa';

const Home = () => {
  const { publicVideos, loading, fetchPublicVideos } = useVideos();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPublicVideos();
  }, []);

  const filteredVideos = publicVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && publicVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-primary-600 text-4xl mb-4" />
        <p className="text-gray-600">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-500">
            {searchTerm ? 'No videos match your search' : 'No videos available'}
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Public Videos ({filteredVideos.length})
          </h1>
          <div className="video-grid">
            {filteredVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;