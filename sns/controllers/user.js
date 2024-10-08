const User = require('../models/user');
const { follow } = require('../services/user');

exports.follow = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const result = await follow(req.user.id, req.params.id);
        if (result === 'ok') {
            res.send('success');
        } else if (result === 'no user'){
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.change = async (req, res, next) => {
    try {
        await User.update({nick: req.body.nickname}, {
            where: { id: req.user.id },
        });
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        next(error);
    }
}