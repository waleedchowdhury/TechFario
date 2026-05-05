const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    proofImage: {
      type: String,
      required: true,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
