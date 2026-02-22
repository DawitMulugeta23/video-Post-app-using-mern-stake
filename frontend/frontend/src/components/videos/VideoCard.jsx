import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  HeartIcon,
  UserCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const VideoCard = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);

  const handleLike = (e) => {
    e.preventDefault();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link to={`/video/${video._id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={video.thumbnailUrl || 'https://via.placeholder.com/640x360'}
            alt={video.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            5:30
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            {video.user?.avatar && !video.user.avatar.includes('default') ? (
              <img
                src={video.user.avatar}
                alt={video.user.username}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-600"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {video.user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {video.user?.username || 'Unknown User'}
              </p>
              
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {video.views || 0}
                </span>
                <button onClick={handleLike} className="flex items-center hover:text-red-500">
                  {liked ? (
                    <HeartIconSolid className="h-4 w-4 mr-1 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 mr-1" />
                  )}
                  {likesCount}
                </button>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(video.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;