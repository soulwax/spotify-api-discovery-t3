// File: scripts/generate-apple-secret.js
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Replace these with your values
const teamId = 'YN3H99VRQV'; // Found in your Apple Developer account
const clientId = 'org.bluesix.spotify.service'; // Your Services ID
const keyId = 'ZW7ACH6WX5'; // The ID of the key you created
const keyPath = path.join(__dirname, '../keys/AuthKey_ZW7ACH6WX5.p8'); // Path to your downloaded key file

const key = fs.readFileSync(keyPath);

const options = {
  algorithm: 'ES256',
  expiresIn: '180d', // Apple allows up to 180 days
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId
};

const token = jwt.sign({}, key, options);
console.log('Your client secret (valid for 180 days):');
console.log(token);