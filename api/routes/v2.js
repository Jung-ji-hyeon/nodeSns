const express = require('express');
const { verifyToken, apiLimiter, corsWhenDomainMatches } = require("../middlewares");
const { createToken, tokenTest, getMyPosts, getPostsByHashtag, getFollow } = require('../controllers/v2');
const cors = require('cors');

const router = express.Router();

router.use(corsWhenDomainMatches);

//  /v2/token
router.post('/token', apiLimiter, createToken);  // req.body.clientSecret
router.get('/test', verifyToken, apiLimiter, tokenTest);

router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtag);
router.get('/follow', verifyToken, apiLimiter, getFollow);

module.exports = router;