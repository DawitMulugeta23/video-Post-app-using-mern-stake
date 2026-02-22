import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../services/api';
import {
  VideoCameraIcon,
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UsersIcon,
  HashtagIcon,
  DocumentTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'entertainment',
    tags: '',
    privacy: 'public',
    allowComments: true,
    video: null,
    thumbnail: null,
  });

  const categories = [
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'food', name: 'Food', icon: '🍳' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'other', name: 'Other', icon: '📌' },
  ];

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a valid video file');
        return;
      }
      
      setFormData({ ...formData, video: file });
      setVideoPreview(URL.createObjectURL(file));
      
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      setFormData({ ...formData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setFormData({ ...formData, video: null });
    setVideoPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.video) {
      toast.error('Please select a video file');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('video', formData.video);
    if (formData.thumbnail) {
      uploadData.append('thumbnail', formData.thumbnail);
    }
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);
    uploadData.append('tags', formData.tags);
    uploadData.append('privacy', formData.privacy);
    uploadData.append('allowComments', formData.allowComments);

    setUploading(true);
    try {
      await videoAPI.uploadVideo(uploadData);
      toast.success('Video uploaded successfully!');
      navigate('/my-videos');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">Share your video with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <VideoCameraIcon className="h-5 w-5 mr-2 text-primary-600" />
              Upload Video
            </h2>
            
            {!videoPreview ? (
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  MP4, MOV, AVI up to 100MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    src={videoPreview}
                    className="w-full max-h-96"
                    controls
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Upload Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-gray-900 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-600" />
              Video Details
            </h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter an engaging title"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell your story, add links, or mention collaborators..."
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/5000 characters
                </p>
              </div>

              {/* Category and Tags Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <HashtagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="gaming, tutorial, vlog (comma separated)"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailPreview(null);
                          setFormData({ ...formData, thumbnail: null });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <PhotoIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">Upload Thumbnail</span>
                      </div>
                    </label>
                  )}
                  <p className="text-xs text-gray-500">
                    Recommended size: 1280x720px
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Settings Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-primary-600" />
              Privacy & Settings
            </h2>
            
            <div className="space-y-4">
              {/* Privacy Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.privacy === 'public' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={formData.privacy === 'public'}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    className="hidden"
                  />
                  <div>
                    <GlobeAltIcon className={`h-6 w-6 mb-2 ${
                      formData.privacy === 'public' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium ${
                      formData.privacy === 'public' ? 'text-primary-600' : 'text-gray-700'
                    }`}>Public</p>
                    <p className="text-xs text-gray-500">Everyone can see</p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.privacy === 'private' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={formData.privacy === 'private'}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    className="hidden"
                  />
                  <div>
                    <LockClosedIcon className={`h-6 w-6 mb-2 ${
                      formData.privacy === 'private' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium ${
                      formData.privacy === 'private' ? 'text-primary-600' : 'text-gray-700'
                    }`}>Private</p>
                    <p className="text-xs text-gray-500">Only you can see</p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.privacy === 'unlisted' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    value="unlisted"
                    checked={formData.privacy === 'unlisted'}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    className="hidden"
                  />
                  <div>
                    <UsersIcon className={`h-6 w-6 mb-2 ${
                      formData.privacy === 'unlisted' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium ${
                      formData.privacy === 'unlisted' ? 'text-primary-600' : 'text-gray-700'
                    }`}>Unlisted</p>
                    <p className="text-xs text-gray-500">Only with link</p>
                  </div>
                </label>
              </div>

              {/* Comments Setting */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    formData.allowComments ? 'bg-primary-600' : 'bg-gray-300'
                  } relative`}>
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                      className="hidden"
                      id="allowComments"
                    />
                    <label
                      htmlFor="allowComments"
                      className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-all cursor-pointer ${
                        formData.allowComments ? 'right-1' : 'left-1'
                      }`}
                    ></label>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Allow Comments</p>
                    <p className="text-xs text-gray-500">Viewers can comment on your video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.video}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Publish Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;