import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon as HeartIconOutline,
  EyeIcon,
  CalendarIcon,
  UserCircleIcon,
  ShareIcon,
  FlagIcon,
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-6">Video not found</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={video.videoUrl}
                controls
                className="w-full"
                poster={video.thumbnailUrl}
              />
            </div>
            
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{video.title}</h1>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Link to={`/profile/${video.user?.username}`} className="flex items-center space-x-3 group">
                    {video.user?.avatar && !video.user.avatar.includes('default') ? (
                      <img
                        src={video.user.avatar}
                        alt={video.user.username}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-600 group-hover:ring-offset-2 transition-all"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center ring-2 ring-indigo-600">
                        <span className="text-lg font-medium text-white">
                          {video.user?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {video.user?.username}
                      </p>
                      <p className="text-sm text-gray-500">Creator</p>
                    </div>
                  </Link>
                  
                  <div className="flex items-center space-x-2 text-gray-500">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <EyeIcon className="h-5 w-5" />
                    <span className="font-medium">{video.views} views</span>
                  </div>
                  
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {liked ? (
                      <HeartIconSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIconOutline className="h-6 w-6 text-gray-500" />
                    )}
                    <span className={liked ? 'text-red-500 font-medium' : 'text-gray-500'}>
                      {likesCount}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Share"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {video.description && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-600 w-1 h-5 rounded-full mr-2"></span>
                More Videos
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="w-full h-24 bg-gradient-to-r from-indigo-200 to-purple-200"></div>
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">Play Video</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Sample Video Title
                    </p>
                    <p className="text-xs text-gray-500">1.2K views • 2 days ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;