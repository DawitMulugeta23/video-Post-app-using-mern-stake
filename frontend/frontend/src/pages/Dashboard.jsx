import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, videoAPI } from '../services/api';
import {
  VideoCameraIcon,
  HeartIcon,
  EyeIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ClockIcon,
  UserGroupIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await userAPI.getProfile();
      setStats(profileRes.data.stats);
      
      const videosRes = await videoAPI.getMyVideos();
      setRecentVideos(videosRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Videos',
      value: stats.totalVideos,
      icon: VideoCameraIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/my-videos',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: EyeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/my-videos',
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes,
      icon: HeartIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/my-videos',
    },
    {
      label: 'Engagement',
      value: stats.totalViews > 0 
        ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) + '%'
        : '0%',
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your content today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`${stat.color} h-6 w-6`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/upload"
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white hover:from-primary-700 hover:to-primary-800 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <VideoCameraIcon className="h-10 w-10 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Upload New Video</h3>
                <p className="text-primary-100">Share your latest content</p>
              </div>
              <ArrowUpIcon className="h-8 w-8 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <UserGroupIcon className="h-10 w-10 text-primary-600 mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Profile</h3>
                <p className="text-gray-600">Update your information</p>
              </div>
              <ArrowUpIcon className="h-8 w-8 text-gray-400 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recent Videos */}
        {recentVideos.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Videos</h2>
              <Link to="/my-videos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <Link
                  key={video._id}
                  to={`/video/${video._id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded-lg"
                      />
                      <PlayCircleIcon className="absolute inset-0 m-auto h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.views || 0} views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {video.likes?.length || 0}
                    </span>
                    <ClockIcon className="h-4 w-4" />
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;