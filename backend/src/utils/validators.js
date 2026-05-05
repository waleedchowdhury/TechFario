const validator = require('validator');

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function requireText(value, field, max = 500) {
  if (typeof value !== 'string' || !value.trim()) {
    throw badRequest(`${field} is required`);
  }

  if (value.trim().length > max) {
    throw badRequest(`${field} must be ${max} characters or fewer`);
  }

  return value.trim();
}

function optionalUrl(value, field) {
  if (!value) {
    return '';
  }

  if (typeof value !== 'string' || !validator.isURL(value, { require_protocol: true })) {
    throw badRequest(`${field} must be a valid URL including http:// or https://`);
  }

  return value.trim();
}

function requireUrl(value, field) {
  const url = requireText(value, field, 1000);

  if (!validator.isURL(url, { require_protocol: true })) {
    throw badRequest(`${field} must be a valid URL including http:// or https://`);
  }

  return url;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function requireEmail(value) {
  const email = requireText(value, 'email', 254).toLowerCase();

  if (!validator.isEmail(email)) {
    throw badRequest('email must be valid');
  }

  return email;
}

module.exports = {
  badRequest,
  normalizeList,
  optionalUrl,
  requireEmail,
  requireText,
  requireUrl
};
