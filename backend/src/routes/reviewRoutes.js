const express = require('express');
const Review = require('../models/Review');
const protect = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');
const { requireText, requireUrl } = require('../utils/validators');

const router = express.Router();

function reviewPayload(body) {
  const rating = Number(body.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error('rating must be an integer from 1 to 5');
    error.statusCode = 400;
    throw error;
  }

  return {
    name: requireText(body.name, 'name', 100),
    position: requireText(body.position, 'position', 140),
    review: requireText(body.review, 'review', 1200),
    rating,
    image: requireUrl(body.image, 'image'),
    proofImage: requireUrl(body.proofImage, 'proofImage')
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({ verified: true }).sort({ createdAt: -1 });
    res.json(reviews);
  })
);

router.get(
  '/admin',
  protect,
  asyncHandler(async (req, res) => {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const review = await Review.create({
      ...reviewPayload(req.body),
      verified: false
    });

    res.status(201).json({
      message: 'Review submitted and awaiting admin verification',
      review
    });
  })
);

router.put(
  '/:id/verify',
  protect,
  validateObjectId,
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { verified: Boolean(req.body.verified) },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  })
);

router.delete(
  '/:id',
  protect,
  validateObjectId,
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted' });
  })
);

module.exports = router;
