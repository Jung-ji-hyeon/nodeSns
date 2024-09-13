const express = require('express');
const { getMyPosts, searchByHashtag, renderMain, follows } = require('../controllers');

const router = express.Router();

router.get('/myposts', getMyPosts);
router.get('/search/:hashtag', searchByHashtag);
router.get('/', renderMain);
router.get('/follow', follows);
module.exports = router;