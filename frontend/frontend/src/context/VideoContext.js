import React, { createContext, useState, useContext } from 'react';
import { videoAPI } from '../Services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const VideoContext = createContext();

export const useVideos = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [publicVideos, setPublicVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch public videos (no auth required)
  const fetchPublicVideos = async () => {
    setLoading(true);
    try {
      const response = await videoAPI.getPublicVideos();
      setPublicVideos(response.data);
    } catch (error) {
      console.error('Error fetching public videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's videos (auth required)
  const fetchMyVideos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await videoAPI.getMyVideos();
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching my videos:', error);
      toast.error('Failed to load your videos');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single video
  const fetchVideo = async (id) => {
    setLoading(true);
    try {
      const response = await videoAPI.getVideo(id);
      setCurrentVideo(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error(error.response?.data?.message || 'Failed to load video');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Upload video
  const uploadVideo = async (formData) => {
    setLoading(true);
    try {
      const response = await videoAPI.uploadVideo(formData);
      setVideos(prev => [response.data.video, ...prev]);
      toast.success('Video uploaded successfully!');
      return { success: true, video: response.data.video };
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update video privacy
  const updatePrivacy = async (videoId, privacy) => {
    try {
      const response = await videoAPI.updatePrivacy(videoId, privacy);
      
      // Update in videos list
      setVideos(prev => prev.map(v => 
        v._id === videoId ? { ...v, privacy: response.data.privacy } : v
      ));
      
      // Update in public videos if needed
      setPublicVideos(prev => prev.map(v => 
        v._id === videoId ? { ...v, privacy: response.data.privacy } : v
      ));
      
      toast.success(`Video is now ${response.data.privacy}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete video
  const deleteVideo = async (videoId) => {
    try {
      await videoAPI.deleteVideo(videoId);
      
      // Remove from videos list
      setVideos(prev => prev.filter(v => v._id !== videoId));
      setPublicVideos(prev => prev.filter(v => v._id !== videoId));
      
      toast.success('Video deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Like/Unlike video
  const likeVideo = async (videoId) => {
    try {
      const response = await videoAPI.likeVideo(videoId);
      
      // Update video in state
      const updateVideoInList = (videosList) => 
        videosList.map(v => 
          v._id === videoId 
            ? { ...v, likes: response.data.isLiked 
                ? [...(v.likes || []), user?._id] 
                : (v.likes || []).filter(id => id !== user?._id) 
              }
            : v
        );
      
      setVideos(prev => updateVideoInList(prev));
      setPublicVideos(prev => updateVideoInList(prev));
      
      if (currentVideo?._id === videoId) {
        setCurrentVideo(prev => ({
          ...prev,
          likes: response.data.isLiked 
            ? [...(prev.likes || []), user?._id]
            : (prev.likes || []).filter(id => id !== user?._id)
        }));
      }
      
      return { success: true, isLiked: response.data.isLiked };
    } catch (error) {
      const message = error.response?.data?.message || 'Action failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    videos,
    publicVideos,
    currentVideo,
    loading,
    fetchPublicVideos,
    fetchMyVideos,
    fetchVideo,
    uploadVideo,
    updatePrivacy,
    deleteVideo,
    likeVideo,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};