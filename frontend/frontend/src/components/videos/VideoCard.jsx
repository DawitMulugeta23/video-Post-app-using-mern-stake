import React from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const VideoCard = ({ video }) => {
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(video.likes?.length || 0);

  const handleLike = async (e) => {
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
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            {Math.floor(Math.random() * 10 + 2)}:30
          </div>
          {video.category && (
            <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              {video.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            {video.user?.avatar && !video.user.avatar.includes('default-avatar') ? (
              <img
                src={video.user.avatar}
                alt={video.user.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-600" />
            )}

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate mb-1">
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
                <span className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  {video.comments?.length || 0}
                </span>
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