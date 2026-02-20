import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaUser } from 'react-icons/fa';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="card group">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnailUrl || 'https://via.placeholder.com/300x200'} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {video.privacy === 'private' && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Private
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
          {video.title}
        </h3>
        
        {video.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaEye className="text-gray-400" />
              <span>{video.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaHeart className="text-red-400" />
              <span>{video.likes?.length || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {video.user?.avatar ? (
              <img 
                src={video.user.avatar}
                alt={video.user.username}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-400 text-xs" />
            )}
            <span className="text-xs">{video.user?.username}</span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-400">
          {new Date(video.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;