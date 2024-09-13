const express = require('express');
const { verifyToken, apiLimiter, corsWhenDomainMatches, premiumApiLimiter } = require("../middlewares");
const { createToken, tokenTest, getMyPosts, getPostsByHashtag, getFollow } = require('../controllers/v2');
const cors = require('cors');
const { Domain } = require('../models');

const router = express.Router();

router.use(corsWhenDomainMatches);
router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
      where: { host: new URL(req.get('origin')).host },
    });
    if (domain.type === 'premium') {
      premiumApiLimiter(req, res, next);
    } else {
      apiLimiter(req, res, next);
    }
  });

//  /v2/token
router.post('/token', createToken);  // req.body.clientSecret
router.get('/test', verifyToken, tokenTest);

router.get('/posts/my', verifyToken, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);
router.get('/follow', verifyToken, getFollow);

module.exports = router;