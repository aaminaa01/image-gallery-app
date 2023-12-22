const express = require('express');
const user_router = express.Router();
const User = require('./config/db');

function checkAdmin(req, res, next) {
  if (res.locals.user.admin) {
    next();
  } else {
    res.status(401).json({ "details": "You need to be an admin to perform this action." });
  }
}

user_router.use(async (req, res, next) => {
  if (req.header('user')) {
    res.locals.user = await User.findOne({ username: req.headers['user'] }).exec();
    next();
  } else {
    res.status(401).json({ "details": "Unauthorized access." });
  }
});

user_router.route('/me').get(async (req, res) => {
  let user = await User.findOne({ username: res.locals.user.username }).exec();
  res.status(200).json(user);
});

user_router.use(express.json());

user_router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let user = await User.findOne({ username: username, password: password });
  if (user) {
    res.status(200).json({ "user": user });
  } else {
    res.status(405).json({ "details": "Incorrect username/password combination." });
  }
});

user_router.route('')
  .get(checkAdmin, async (req, res) => {
    let users = await User.find({});
    res.status(200).json(users);
  })
  .post(checkAdmin, async (req, res) => {
    let user = req.body;
    if ((await User.find({ username: user.username })).length !== 0) {
      res.status(200).json({ "details": "Username already exists." });
    } else {
      await User.create(user);
      res.status(200).json({ "details": "Added user successfully." });
    }
  })
  .put(async (req, res) => {
    let username = req.body.username;
    let to_update = req.body.to_update;
    await User.findOneAndUpdate({ username: username }, to_update);
    res.status(200).json({ "details": "Details updated successfully!" });
  });

module.exports = user_router;
