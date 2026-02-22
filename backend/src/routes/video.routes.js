const express = require('express');
const router = express.Router();
const { protect } = require('../middelware/middelware.auths');
const {
  uploadVideo,
  getPublicVideos,
  getMyVideos,
  getVideo,
  updatePrivacy,
  deleteVideo,
  likeVideo,
  updateVideo
} = require('../controller/video.controller');

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
router.put('/:id', protect, updateVideo);

module.exports = router;