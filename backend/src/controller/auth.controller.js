const User = require('../model/users.models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService.utils'); 
const { sendTemplatedEmail } = require('../utils/emailTemplates');

// Helper function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Helper function to update timestamps
const updateTimestamps = (user) => {
  user.updatedAt = Date.now();
  return user;
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Registration attempt:', { username, email });

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // Hash password in controller
    const hashedPassword = await hashPassword(password);

    // Create user with hashed password
    const user = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Save user
    await user.save();

    console.log('User created:', user._id);

    // Generate verification token
    const verificationToken = user.generateEmailVerificationToken();
    user.updatedAt = Date.now(); // Manually update timestamp
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    try {
      await sendTemplatedEmail(sendEmail, {
        to: user.email,
        template: 'welcome',
        data: {
          username: user.username,
          verificationUrl,
        },
      });
    } catch (emailError) {
      console.log('Email sending failed (but user was created):', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is locked
    if (user.isLocked && user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${lockTime} minutes`,
      });
    }

    // Compare password using helper function
    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      // Increment login attempts
      if (user.incLoginAttempts) {
        await user.incLoginAttempts();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = null;
    }

    // Update last login and timestamp
    user.lastLogin = Date.now();
    user.updatedAt = Date.now();
    await user.save();

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email,
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        website: user.website,
        location: user.location,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    user.updatedAt = Date.now(); // Manually update timestamp
    await user.save();

    // Send confirmation email
    await sendTemplatedEmail(sendEmail, {
      to: user.email,
      template: 'emailVerified',
      data: {
        username: user.username,
      },
    });

    res.json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email',
      });
    }

    // Generate reset token
    const resetToken = user.generateResetPasswordToken();
    user.updatedAt = Date.now(); // Manually update timestamp
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    try {
      await sendTemplatedEmail(sendEmail, {
        to: user.email,
        template: 'passwordReset',
        data: {
          username: user.username,
          resetUrl,
        },
      });

      res.json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      // If email fails, clear reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.updatedAt = Date.now();
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Hash new password in controller
    const hashedPassword = await hashPassword(password);

    // Set new password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.updatedAt = Date.now(); // Manually update timestamp
    await user.save();

    // Send confirmation email
    await sendTemplatedEmail(sendEmail, {
      to: user.email,
      template: 'passwordChanged',
      data: {
        username: user.username,
      },
    });

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    
    // Compare current password
    const isMatch = await comparePassword(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    user.password = hashedPassword;
    user.updatedAt = Date.now(); // Manually update timestamp
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updatePassword,
  logout,
};