const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 900
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    techStack: {
      type: [String],
      default: []
    },
    liveLink: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
