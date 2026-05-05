const express = require('express');
const Project = require('../models/Project');
const protect = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeList, requireText, requireUrl } = require('../utils/validators');

const router = express.Router();

function projectPayload(body) {
  return {
    title: requireText(body.title, 'title', 120),
    description: requireText(body.description, 'description', 900),
    image: requireUrl(body.image, 'image'),
    techStack: normalizeList(body.techStack),
    liveLink: requireUrl(body.liveLink, 'liveLink')
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  })
);

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const project = await Project.create(projectPayload(req.body));
    res.status(201).json(project);
  })
);

router.put(
  '/:id',
  protect,
  validateObjectId,
  asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, projectPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  })
);

router.delete(
  '/:id',
  protect,
  validateObjectId,
  asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  })
);

module.exports = router;
