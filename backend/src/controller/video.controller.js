const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'video-posts',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
    chunk_size: 6000000, // 6MB chunks for large files
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
}).single('video');

// @desc    Upload video
// @route   POST /api/videos
// @access  Private
const uploadVideo = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a video file' });
      }

      const { title, description, privacy } = req.body;

      const video = await Video.create({
        title,
        description,
        videoUrl: req.file.path,
        thumbnailUrl: req.file.path.replace('.mp4', '.jpg'), // Cloudinary generates thumbnail
        publicId: req.file.filename,
        privacy: privacy || 'public',
        user: req.user._id,
      });

      res.status(201).json({
        message: 'Video uploaded successfully',
        video,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

// @desc    Get all public videos
// @route   GET /api/videos/public
// @access  Public
const getPublicVideos = async (req, res) => {
  try {
    const videos = await Video.find({ privacy: 'public' })
      .populate('user', 'username avatar')
      .sort('-createdAt');

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's videos (public and private)
// @route   GET /api/videos/my-videos
// @access  Private
const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user._id })
      .sort('-createdAt');

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public/Private (based on privacy)
const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('user', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check privacy
    if (video.privacy === 'private') {
      if (!req.user || req.user._id.toString() !== video.user._id.toString()) {
        return res.status(403).json({ message: 'This video is private' });
      }
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update video privacy
// @route   PUT /api/videos/:id/privacy
// @access  Private
const updatePrivacy = async (req, res) => {
  try {
    const { privacy } = req.body;

    if (!['public', 'private'].includes(privacy)) {
      return res.status(400).json({ message: 'Invalid privacy setting' });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    video.privacy = privacy;
    await video.save();

    res.json({
      message: `Video is now ${privacy}`,
      privacy: video.privacy,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });

    await video.deleteOne();

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like/Unlike video
// @route   POST /api/videos/:id/like
// @access  Private
const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if already liked
    const likedIndex = video.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      // Like video
      video.likes.push(req.user._id);
    } else {
      // Unlike video
      video.likes.splice(likedIndex, 1);
    }

    await video.save();

    res.json({
      likes: video.likes.length,
      isLiked: likedIndex === -1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadVideo,
  getPublicVideos,
  getMyVideos,
  getVideo,
  updatePrivacy,
  deleteVideo,
  likeVideo,
};