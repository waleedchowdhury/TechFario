const express = require('express');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Project = require('../models/Project');
const Review = require('../models/Review');
const TeamMember = require('../models/TeamMember');
const protect = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/stats',
  protect,
  asyncHandler(async (req, res) => {
    const [totalProjects, totalTeamMembers, totalReviews, totalNewsletterSubscribers] =
      await Promise.all([
        Project.countDocuments(),
        TeamMember.countDocuments(),
        Review.countDocuments(),
        NewsletterSubscriber.countDocuments()
      ]);

    res.json({
      totalProjects,
      totalTeamMembers,
      totalReviews,
      totalNewsletterSubscribers
    });
  })
);

module.exports = router;
