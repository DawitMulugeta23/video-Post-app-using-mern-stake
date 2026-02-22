import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { PencilIcon, TrashIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
        <Link to="/upload" className="btn-primary">
          Upload New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">You haven't uploaded any videos yet</p>
          <Link to="/upload" className="btn-primary">
            Upload Your First Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handlePrivacyToggle(video)}
                    className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90"
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
                  <span>{video.views || 0} views</span>
                  <span>{video.likes?.length || 0} likes</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
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
                    className="flex-1 btn-secondary text-center"
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
  );
};

export default MyVideos;