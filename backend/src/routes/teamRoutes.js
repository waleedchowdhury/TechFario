const express = require('express');
const TeamMember = require('../models/TeamMember');
const protect = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeList, optionalUrl, requireText, requireUrl } = require('../utils/validators');

const router = express.Router();

function memberPayload(body) {
  const socialLinks = body.socialLinks || {};

  return {
    name: requireText(body.name, 'name', 100),
    role: requireText(body.role, 'role', 100),
    skills: normalizeList(body.skills),
    image: requireUrl(body.image, 'image'),
    socialLinks: {
      linkedin: optionalUrl(socialLinks.linkedin, 'linkedin'),
      github: optionalUrl(socialLinks.github, 'github'),
      twitter: optionalUrl(socialLinks.twitter, 'twitter'),
      website: optionalUrl(socialLinks.website, 'website')
    }
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const team = await TeamMember.find().sort({ createdAt: -1 });
    res.json(team);
  })
);

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const member = await TeamMember.create(memberPayload(req.body));
    res.status(201).json(member);
  })
);

router.put(
  '/:id',
  protect,
  validateObjectId,
  asyncHandler(async (req, res) => {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, memberPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(member);
  })
);

router.delete(
  '/:id',
  protect,
  validateObjectId,
  asyncHandler(async (req, res) => {
    const member = await TeamMember.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted' });
  })
);

module.exports = router;
