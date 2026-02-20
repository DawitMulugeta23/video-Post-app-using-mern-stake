const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  uploadVideo,
  getPublicVideos,
  getMyVideos,
  getVideo,
  updatePrivacy,
  deleteVideo,
  likeVideo,
} = require('../controllers/videoController');

// Public routes
router.get('/public', getPublicVideos);
router.get('/:id', getVideo);

// Protected routes
router.use(protect);
router.post('/', uploadVideo);
router.get('/my-videos/all', getMyVideos);
router.put('/:id/privacy', updatePrivacy);
router.delete('/:id', deleteVideo);
router.post('/:id/like', likeVideo);

module.exports = router;