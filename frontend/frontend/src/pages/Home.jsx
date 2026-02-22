import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videoAPI } from '../services/api';
import VideoCard from '../components/videos/VideoCard';
import {
  PlayIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const fetchFeaturedVideos = async () => {
    try {
      const response = await videoAPI.getPublicVideos();
      setFeaturedVideos(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: PlayIcon,
      title: 'Upload Videos',
      description: 'Share your stories with the world in high quality',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: UserGroupIcon,
      title: 'Build Community',
      description: 'Connect with creators and grow your audience',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Track Performance',
      description: 'Get insights on your content and engagement',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Your content is safe with our privacy controls',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <SparklesIcon className="h-12 w-12 mx-auto mb-6 text-primary-200" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Share Your Story
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-10">
              Join thousands of creators sharing amazing videos with the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/upload" : "/register"}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-700 bg-white hover:bg-gray-50 md:text-lg"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Creating
              </Link>
              <Link
                to="/posts"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-primary-700 md:text-lg"
              >
                Browse Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you create, share, and grow your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`${feature.color} h-8 w-8`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      {featuredVideos.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Videos</h2>
                <p className="text-gray-600">Discover amazing content from our community</p>
              </div>
              <Link
                to="/posts"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View All
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our community today and start sharing your videos with the world
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center px-6 py-3 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-primary-700 transition-colors"
          >
            Get Started Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;