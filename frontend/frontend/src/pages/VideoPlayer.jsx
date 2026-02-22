import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon as HeartIconOutline,
  EyeIcon,
  CalendarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await videoAPI.getVideo(id);
      setVideo(response.data);
      setLikesCount(response.data.likes?.length || 0);
      setLiked(response.data.likes?.includes(user?._id));
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos');
      return;
    }

    try {
      const response = await videoAPI.likeVideo(id);
      setLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Video not found</p>
        <Link to="/" className="btn-primary mt-4">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              src={video.videoUrl}
              controls
              className="w-full"
              poster={video.thumbnailUrl}
            />
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${video.user?.username}`} className="flex items-center space-x-2">
                  {video.user?.avatar && !video.user.avatar.includes('default-avatar') ? (
                    <img
                      src={video.user.avatar}
                      alt={video.user.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-600" />
                  )}
                  <span className="font-medium text-gray-900">{video.user?.username}</span>
                </Link>
                
                <div className="flex items-center space-x-1 text-gray-500">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-sm">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-500">
                  <EyeIcon className="h-5 w-5" />
                  <span>{video.views} views</span>
                </div>
                
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                >
                  {liked ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIconOutline className="h-6 w-6" />
                  )}
                  <span>{likesCount}</span>
                </button>
              </div>
            </div>
            
            {video.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - You can add related videos here */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-gray-900 mb-4">More Videos</h2>
            <p className="text-gray-500 text-center py-8">
              Related videos coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;