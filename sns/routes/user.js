const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { follow, unfollow , change } = require('../controllers/user');

router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/unfollow', isLoggedIn, unfollow);
router.post('/profile', isLoggedIn, change);

module.exports = router;