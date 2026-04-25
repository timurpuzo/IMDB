const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const response = require('../utils/responseFactory');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response.error(res, errors.array()[0].msg, 400);
      }

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return response.error(res, 'Email or username already exists', 400);
      }

      const user = await User.create({ username, email, password });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      response.success(res, { user, token }, 201);
    } catch (err) {
      response.error(res, err.message);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response.error(res, errors.array()[0].msg, 400);
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return response.error(res, 'Invalid email or password', 401);
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      response.success(res, { user, token });
    } catch (err) {
      response.error(res, err.message);
    }
  }
);

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  response.success(res, req.user);
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    response.success(res, user);
  } catch (err) {
    response.error(res, err.message, 400);
  }
});

module.exports = router;
