const { totp } = require('otplib');

// Set up your TOTP secret and options
const { TOTP_SECRET, BYPASS_AUTH } = process.env;
totp.options = { digits: 6, step: 30 }; // Customize options as needed

const totpMiddleware = (req, res, next) => {
  if (BYPASS_AUTH === '1') {
    return next();
  }
  const token = req.headers['x-totp-token'];

  if (!token) {
    return res.status(401).json({ error: 'TOTP token is required' });
  }

  if (!totp.check(token, TOTP_SECRET)) {
    return res.status(401).json({ error: 'Invalid TOTP token' });
  }

  return next();
};

module.exports = totpMiddleware;
