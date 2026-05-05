const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireEmail, requireText } = require('../utils/validators');

const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const name = requireText(req.body.name, 'name', 100);
    const email = requireEmail(req.body.email);
    const message = requireText(req.body.message, 'message', 2000);

    res.status(201).json({
      message: 'Message received',
      contact: {
        name,
        email,
        message,
        receivedAt: new Date().toISOString()
      }
    });
  })
);

module.exports = router;
