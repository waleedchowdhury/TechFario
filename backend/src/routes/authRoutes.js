const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { requireEmail, requireText } = require('../utils/validators');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const email = requireEmail(req.body.email);
    const password = requireText(req.body.password, 'password', 200);
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  })
);

router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    const existingAdminCount = await User.countDocuments();

    if (existingAdminCount > 0) {
      return protect(req, res, next);
    }

    next();
  }),
  asyncHandler(async (req, res) => {
    const username = requireText(req.body.username, 'username', 40);
    const email = requireEmail(req.body.email);
    const password = requireText(req.body.password, 'password', 200);

    if (password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      token: signToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  })
);

module.exports = router;
