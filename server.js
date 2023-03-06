const express = require('express');
const { check, validationResult } = require('express-validator');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
app.use(express.json());

// Initialize Firestore client
const db = new Firestore();

// Require a secret from env
const SECRET = process.env.SECRET;

// GET endpoint to get a list of users sorted by similarity to the input user
app.get('/users', [
  check('user.latitude').isNumeric().optional(),
  check('user.longitude').isNumeric().optional(),
  check('user.attribute1').isString().optional(),
  check('user.attribute2').isString().optional(),
  check('user.attribute3').isString().optional(),
  check('user.attribute4').isString().optional(),
  check('user.attribute5').isString().optional(),
  check('distance').isNumeric().optional(),
  check('secret').equals(SECRET),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const user = req.query.user || {};

  // Get all users from Firestore
  const snapshot = await db.collection('users').get();

  // Sort the users by similarity to the input user
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  users.forEach(a => {
    if (user.latitude && user.longitude) {
      const distance = getDistance(user.latitude, user.longitude, a.latitude, a.longitude);
      a.distance = distance;
    }
    let similarity = 0;
    if (user.attribute1 && a.attribute1 && user.attribute1 === a.attribute1) {
      similarity += 6;
    }
    if (user.attribute2 && a.attribute2 && user.attribute2 === a.attribute2) {
      similarity += 5;
    }
    if (user.attribute3 && a.attribute3 && user.attribute3 === a.attribute3) {
      similarity += 4;
    }
    if (user.attribute4 && a.attribute4 && user.attribute4 === a.attribute4) {
      similarity += 3;
    }
    if (user.attribute5 && a.attribute5 && user.attribute5 === a.attribute5) {
      similarity += 2;
    }
    a.similarity = similarity;
  });
  users.sort((a, b) => b.similarity - a.similarity);

  if (user.latitude && user.longitude && req.query.distance) {
    const maxDistance = req.query.distance;
    users = users.filter(a => a.distance <= maxDistance);
  }

  res.json(users);
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d * 60; // Distance in minutes
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
