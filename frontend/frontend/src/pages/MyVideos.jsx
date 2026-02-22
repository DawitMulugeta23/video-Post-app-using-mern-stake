import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { 
  PencilIcon, 
  TrashIcon, 
  GlobeAltIcon, 
  LockClosedIcon,
  EyeIcon,
  HeartIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = async () => {
    try {
      const response = await videoAPI.getMyVideos();
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await videoAPI.deleteVideo(videoId);
      setVideos(videos.filter(v => v._id !== videoId));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handlePrivacyToggle = async (video) => {
    const newPrivacy = video.privacy === 'public' ? 'private' : 'public';
    
    try {
      await videoAPI.updatePrivacy(video._id, newPrivacy);
      setVideos(videos.map(v => 
        v._id === video._id ? { ...v, privacy: newPrivacy } : v
      ));
      toast.success(`Video is now ${newPrivacy}`);
    } catch (error) {
      console.error('Error updating privacy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
            <p className="text-gray-600 mt-2">Manage your video content</p>
          </div>
          <Link
            to="/create"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center shadow-lg"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Upload New Video
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="bg-indigo-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <VideoCameraIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-500 mb-8">Start sharing your content with the world</p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Upload Your First Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="relative group">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handlePrivacyToggle(video)}
                      className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-110"
                      title={`Make ${video.privacy === 'public' ? 'private' : 'public'}`}
                    >
                      {video.privacy === 'public' ? (
                        <GlobeAltIcon className="h-4 w-4" />
                      ) : (
                        <LockClosedIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {video.views || 0}
                    </span>
                    <span className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {video.likes?.length || 0}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.privacy === 'public' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.privacy}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/video/${video._id}`}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVideos;