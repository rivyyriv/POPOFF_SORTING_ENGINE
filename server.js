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
  check('user.latitude').isNumeric(),
  check('user.longitude').isNumeric(),
  check('user.interests').isArray(),
  check('user.attribute4').isString(),
  check('user.attribute5').isString(),
  check('secret').equals(SECRET),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const user = req.query.user;

  // Get all users from Firestore
  const snapshot = await db.collection('users').get();

  // Sort the users by similarity to the input user
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  users.forEach(a => {
    const distance = getDistance(user.latitude, user.longitude, a.latitude, a.longitude);
    a.distance = distance;
  });
  users.sort((a, b) => {
    const weightings = [
      { key: 'distance', weight: 6 },
      { key: 'elo', weight: 5 },
      { key: 'interests', weight: 4 },
      { key: 'attribute4', weight: 3 },
      { key: 'attribute5', weight: 2 },
    ];

    const similarityA = weightings.reduce((similarity, { key, weight }) => {
      return similarity + (a[key] === user[key] ? weight : 0);
    }, 0);

    const similarityB = weightings.reduce((similarity, { key, weight }) => {
      return similarity + (b[key] === user[key] ? weight : 0);
    }, 0);

    return similarityB - similarityA;
  });

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
