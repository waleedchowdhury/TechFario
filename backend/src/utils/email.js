const nodemailer = require('nodemailer');

function smtpReady() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

function createTransporter() {
  if (!smtpReady()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendBulkEmail({ recipients, subject, message }) {
  const transporter = createTransporter();

  if (!transporter) {
    const error = new Error('SMTP settings are not configured');
    error.statusCode = 400;
    throw error;
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    bcc: recipients,
    subject,
    text: message,
    html: message.replace(/\n/g, '<br>')
  });

  return info;
}

module.exports = {
  sendBulkEmail,
  smtpReady
};
