var admin = require('firebase-admin');

var serviceAccount = require('graduation-project-c9688-firebase-adminsdk-we9nz-42e62da048.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://graduation-project-c9688-default-rtdb.firebaseio.com',
});

const message = {};

admin.messaging().send();
