const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    skills: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
