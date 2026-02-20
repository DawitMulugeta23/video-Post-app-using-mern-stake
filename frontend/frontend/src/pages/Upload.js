import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import { FaCloudUploadAlt, FaSpinner, FaGlobe, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';  

const Upload = () => {
  const navigate = useNavigate();
  const { uploadVideo, loading } = useVideos();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: 'public',
    video: null,
  });
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a valid video file');
        return;
      }

      setFormData({ ...formData, video: file });
      
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.video) {
      toast.error('Please select a video');
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

    const result = await uploadVideo(uploadData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container-custom py-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Video</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            {preview ? (
              <div className="space-y-4">
                <video src={preview} controls className="w-full max-h-96 rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFormData({ ...formData, video: null });
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove video
                </button>
              </div>
            ) : (
              <div className="text-center">
                <FaCloudUploadAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your video here, or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: MP4, MOV, AVI, MKV (Max 100MB)
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  Select Video
                </label>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Video Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-field"
                placeholder="Enter video description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Setting
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={formData.privacy === 'public'}
                    onChange={handleChange}
                  />
                  <FaGlobe className="text-green-600" />
                  <span>Public</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={formData.privacy === 'private'}
                    onChange={handleChange}
                  />
                  <FaLock className="text-red-600" />
                  <span>Private</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !formData.video}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Upload Video'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;