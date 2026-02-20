import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaEye, FaUser, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchVideo, likeVideo, currentVideo, loading } = useVideos();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadVideo();
  }, [id]);

  useEffect(() => {
    if (currentVideo && user) {
      setIsLiked(currentVideo.likes?.includes(user._id));
    }
  }, [currentVideo, user]);

  const loadVideo = async () => {
    const video = await fetchVideo(id);
    if (!video) {
      toast.error('Video not found');
      navigate('/');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like videos');
      navigate('/login');
      return;
    }
    
    const result = await likeVideo(id);
    if (result.success) {
      setIsLiked(result.isLiked);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Video not found</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Video Player */}
        <div className="aspect-video bg-black">
          <video 
            src={currentVideo.videoUrl} 
            controls 
            className="w-full h-full"
            poster={currentVideo.thumbnailUrl}
          />
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {currentVideo.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {currentVideo.user?.avatar ? (
                  <img 
                    src={currentVideo.user.avatar}
                    alt={currentVideo.user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <FaUser className="text-primary-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">
                    {currentVideo.user?.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(currentVideo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FaEye className="text-gray-400 text-xl" />
                <span className="text-gray-600">{currentVideo.views} views</span>
              </div>
              
              <button 
                onClick={handleLike}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <FaHeart 
                  className={`text-2xl ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  } transition-colors`} 
                />
                <span className="text-gray-600">{currentVideo.likes?.length || 0}</span>
              </button>
            </div>
          </div>

          {currentVideo.description && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {currentVideo.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;