import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About VideoPost</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            We're on a mission to empower creators and connect communities through video
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                VideoPost was born from a simple idea: everyone has a story worth sharing. 
                We believe that video is the most powerful medium to connect, inspire, and entertain.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What started as a small project has grown into a vibrant community of creators, 
                artists, and storytellers from around the world.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to host thousands of videos and help creators build their audience 
                while maintaining full control over their content.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-8 rounded-3xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                  <div className="text-gray-600">Videos</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">5K+</div>
                  <div className="text-gray-600">Creators</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">1M+</div>
                  <div className="text-gray-600">Views</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            To create a platform where creativity flows freely, communities thrive, 
            and every voice has the chance to be heard.
          </p>
          <Link
            to={isAuthenticated ? "/upload" : "/register"}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Join Our Community
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;