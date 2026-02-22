const User = require('../model/users.models');
const Video = require('../model/video');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/config.cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer for avatar upload
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-avatars',
    width: 200,
    height: 200,
    crop: 'fill',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
}).single('avatar');


// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -emailVerificationToken -resetPasswordToken')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -resetPasswordToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's videos
    const videos = await Video.find({ user: user._id })
      .select('title description thumbnailUrl privacy views createdAt')
      .sort('-createdAt');

    res.json({
      success: true,
      user,
      videos,
      videoCount: videos.length,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -emailVerificationToken -resetPasswordToken');

    // Get user's videos with stats
    const videos = await Video.find({ user: user._id })
      .select('title description thumbnailUrl privacy views likes createdAt')
      .sort('-createdAt');

    // Calculate stats
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + (video.likes?.length || 0), 0);
    const publicVideos = videos.filter(v => v.privacy === 'public').length;
    const privateVideos = videos.filter(v => v.privacy === 'private').length;

    res.json({
      success: true,
      user,
      stats: {
        totalVideos: videos.length,
        publicVideos,
        privateVideos,
        totalViews,
        totalLikes,
      },
      recentVideos: videos.slice(0, 5),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, bio, website, location } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if username is taken
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
        });
      }
      user.username = username;
    }

    // Check if email is taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }
      user.email = email;
      user.isEmailVerified = false; // Require re-verification if email changes
    }

    // Update other fields
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (location !== undefined) user.location = location;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @access  Private
const uploadAvatar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image',
        });
      }

      const user = await User.findById(req.user._id);

      // Delete old avatar from cloudinary if not default
      if (user.avatar && !user.avatar.includes('default-avatar')) {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`user-avatars/${publicId}`);
      }

      // Update user avatar
      user.avatar = req.file.path;
      await user.save();

      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatar: user.avatar,
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  });
};

// @access  Private
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Delete all user's videos from cloudinary
    const videos = await Video.find({ user: user._id });
    for (const video of videos) {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    }

    // Delete user's avatar if not default
    if (user.avatar && !user.avatar.includes('default-avatar')) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`user-avatars/${publicId}`);
    }

    // Delete user's videos from database
    await Video.deleteMany({ user: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @access  Private
const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get recent videos
    const recentVideos = await Video.find({ user: userId })
      .select('title createdAt views likes')
      .sort('-createdAt')
      .limit(10);

    // Get liked videos
    const likedVideos = await Video.find({ likes: userId })
      .populate('user', 'username avatar')
      .select('title thumbnailUrl user createdAt')
      .sort('-createdAt')
      .limit(10);

    // Get activity timeline
    const activity = [];

    // Add video uploads to activity
    recentVideos.forEach(video => {
      activity.push({
        type: 'upload',
        video: video.title,
        videoId: video._id,
        date: video.createdAt,
      });
    });

    // Sort activity by date
    activity.sort((a, b) => b.date - a.date);

    res.json({
      success: true,
      stats: {
        totalVideos: await Video.countDocuments({ user: userId }),
        totalLikes: await Video.countDocuments({ likes: userId }),
        totalViews: (await Video.find({ user: userId })).reduce((sum, v) => sum + v.views, 0),
      },
      recentVideos,
      likedVideos,
      recentActivity: activity.slice(0, 20),
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Admin: Delete any user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Delete user's videos and avatar
    const videos = await Video.find({ user: user._id });
    for (const video of videos) {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    }

    if (user.avatar && !user.avatar.includes('default-avatar')) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`user-avatars/${publicId}`);
    }

    await Video.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Admin delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Add to user.controller.js
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -emailVerificationToken -resetPasswordToken -email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Get user's public videos
    const videos = await Video.find({ 
      user: user._id,
      privacy: 'public' 
    })
    .select('title description thumbnailUrl views likes createdAt')
    .sort('-createdAt');
    
    res.json({
      success: true,
      user,
      videos,
      videoCount: videos.length,
    });
  } catch (error) {
    console.error('Get user by username error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteUserAccount,
  getUserActivity,
  updateUserRole,
  adminDeleteUser,
  getUserByUsername
};