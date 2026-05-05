const express = require('express');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const protect = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { sendBulkEmail } = require('../utils/email');
const { requireEmail, requireText } = require('../utils/validators');

const router = express.Router();

router.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    const email = requireEmail(req.body.email);
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { email, subscribedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: 'Subscription saved',
      subscriber
    });
  })
);

router.get(
  '/subscribers',
  protect,
  asyncHandler(async (req, res) => {
    const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  })
);

router.post(
  '/send-email',
  protect,
  asyncHandler(async (req, res) => {
    const subject = requireText(req.body.subject, 'subject', 160);
    const message = requireText(req.body.message, 'message', 6000);
    const subscribers = await NewsletterSubscriber.find().select('email');

    if (!subscribers.length) {
      return res.status(400).json({ message: 'No subscribers available' });
    }

    const recipients = subscribers.map((subscriber) => subscriber.email);
    const info = await sendBulkEmail({ recipients, subject, message });

    res.json({
      message: `Email queued for ${recipients.length} subscribers`,
      messageId: info.messageId
    });
  })
);

module.exports = router;
