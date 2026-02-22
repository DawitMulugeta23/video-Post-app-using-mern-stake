import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: 'public',
    video: null,
  });
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      setFormData({ ...formData, video: file });
      setPreview(URL.createObjectURL(file));
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
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('privacy', formData.privacy);

    setUploading(true);
    try {
      await videoAPI.uploadVideo(uploadData);
      toast.success('Video uploaded successfully!');
      navigate('/my-videos');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setFormData({ ...formData, video: null });
    setPreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload Area */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File *
          </label>
          
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <VideoCameraIcon className="h-12 w-12 text-gray-400 mb-3" />
                <span className="text-primary-600 font-medium">Click to upload</span>
                <span className="text-gray-500 text-sm mt-1">
                  or drag and drop
                </span>
                <span className="text-gray-400 text-xs mt-2">
                  MP4, MOV, AVI up to 100MB
                </span>
              </label>
            </div>
          ) : (
            <div className="relative">
              <video
                src={preview}
                className="w-full rounded-lg"
                controls
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Enter video title"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="4"
              placeholder="Describe your video"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy
            </label>
            <select
              value={formData.privacy}
              onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
              className="input-field"
            >
              <option value="public">Public - Everyone can see</option>
              <option value="private">Private - Only you can see</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </span>
            ) : (
              'Upload Video'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;