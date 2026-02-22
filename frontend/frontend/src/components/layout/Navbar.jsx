import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition, Dialog } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  DocumentTextIcon,
  FilmIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChartBarIcon,
  VideoCameraIcon,
  PlusCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Posts', href: '/posts', icon: DocumentTextIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-all">
                  <FilmIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  VideoPost
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center shadow-md"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-1" />
                    Create
                  </Link>
                  
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 focus:outline-none group">
                      {user?.avatar && !user.avatar.includes('default') ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-600 group-hover:ring-offset-2 transition-all"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center ring-2 ring-indigo-600 group-hover:ring-offset-2 transition-all">
                          <span className="text-sm font-medium text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:text-indigo-600" />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg py-2 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`${
                                active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                              } flex items-center px-4 py-2 text-sm transition-colors`}
                            >
                              <ChartBarIcon className="h-4 w-4 mr-3" />
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                              } flex items-center px-4 py-2 text-sm transition-colors`}
                            >
                              <UserCircleIcon className="h-4 w-4 mr-3" />
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/my-videos"
                              className={`${
                                active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                              } flex items-center px-4 py-2 text-sm transition-colors`}
                            >
                              <VideoCameraIcon className="h-4 w-4 mr-3" />
                              My Videos
                            </Link>
                          )}
                        </Menu.Item>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                              } flex items-center w-full text-left px-4 py-2 text-sm transition-colors`}
                            >
                              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 rounded-lg hover:bg-indigo-50"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setMobileMenuOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pt-5 pb-2">
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-2 px-4 py-6 space-y-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center text-gray-700 hover:text-indigo-600 py-2 text-base font-medium"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}

                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/create"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center text-indigo-600 py-2 text-base font-medium border-t border-gray-100 pt-4"
                        >
                          <PlusCircleIcon className="h-5 w-5 mr-3" />
                          Create Post
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center text-gray-700 hover:text-indigo-600 py-2 text-base font-medium"
                        >
                          <ChartBarIcon className="h-5 w-5 mr-3" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center text-gray-700 hover:text-indigo-600 py-2 text-base font-medium"
                        >
                          <UserCircleIcon className="h-5 w-5 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to="/my-videos"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center text-gray-700 hover:text-indigo-600 py-2 text-base font-medium"
                        >
                          <VideoCameraIcon className="h-5 w-5 mr-3" />
                          My Videos
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center text-red-600 hover:text-red-700 py-2 text-base font-medium w-full border-t border-gray-100 pt-4"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="space-y-3 border-t border-gray-100 pt-4">
                        <Link
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-indigo-700"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full text-center border border-indigo-600 text-indigo-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-indigo-50"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </nav>
    </>
  );
};

export default Navbar;