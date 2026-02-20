import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';
import { FaUser, FaVideo, FaGlobe, FaLock, FaSpinner, FaEye } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const { videos, loading, fetchMyVideos } = useVideos();

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const stats = {
    total: videos.length,
    public: videos.filter(v => v.privacy === 'public').length,
    private: videos.filter(v => v.privacy === 'private').length,
    views: videos.reduce((acc, v) => acc + (v.views || 0), 0),
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-primary-600 text-4xl mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* User Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-primary-600 text-2xl" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Videos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FaVideo className="text-4xl text-primary-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Public Videos</p>
              <p className="text-3xl font-bold text-green-600">{stats.public}</p>
            </div>
            <FaGlobe className="text-4xl text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Private Videos</p>
              <p className="text-3xl font-bold text-red-600">{stats.private}</p>
            </div>
            <FaLock className="text-4xl text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-primary-600">{stats.views}</p>
            </div>
            <FaEye className="text-4xl text-primary-400" />
          </div>
        </div>
      </div>

      {/* My Videos Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Videos</h2>
        <Link to="/upload" className="btn-primary">
          Upload New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <FaVideo className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No videos yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start by uploading your first video!
          </p>
          <Link to="/upload" className="btn-primary inline-block">
            Upload Video
          </Link>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;