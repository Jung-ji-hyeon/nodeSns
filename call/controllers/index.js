const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    })
  } catch (error) {
    if (error.response?.status === 419) {
      delete req.session.jwt;
      return request(req, api);
    }
    return error.response;
  }
};

exports.getMyPosts = async (req ,res, next) => {
  try {
  const result = await request(req, '/posts/my');
  res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }

};

exports.searchByHashtag = async (req, res, next) => {
  try {
  const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
  res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderMain = (req, res) => {
  res.render('main', { key: process.env.FRONT_SECRET });
}

exports.follows = async (req, res, next) => {
  try {
    const result = await request(req, `/follow`);
    res.json(result.data);
    } catch (error) {
      console.error(error);
      next(error);
    }
};