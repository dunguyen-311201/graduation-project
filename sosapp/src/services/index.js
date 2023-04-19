const admin = require('firebase-admin');

const serviceAccount = require('./graduation-project-c9688-firebase-adminsdk-we9nz-42e62da048.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://graduation-project-c9688-default-rtdb.firebaseio.com',
});

const db = admin.database();

const messagesRef = db.ref('messages');

messagesRef.limitToLast(1).on('value', async snapshot => {
  console.log(snapshot.val());
  const message = {
    notification: {
      title: 'Bacsic Notification',
      body: JSON.stringify(snapshot.val()),
      imageUrl: 'https://static.invertase.io/assets/React-Native-Firebase.svg',
    },
    token:
      'd6R9xT6wS962uqttWq7W5B:APA91bG3S4r4kqVZ1zq3I1knerCXXjeuKq447ilB349_-6NOWAaSPCld_8vY1ekQokKDTZ5wM5eEnyNa73jqFT4VQWcZPHRhJVz2AwyaU4SpdeWatgxR8yzNaAcvPDE0Ih3rtEnN1S-I',
    //'cl3HO9ttRLOFZwiCvHWLaF:APA91bFlCDpTGmn-980Bo5qz62ebooJCWf4PlSFPy6gg9a-pfSj4HEVgja1SoEiCN8MaicOtquF8neEQL9DYQEy5BRpNdx0dIVE4WlAIYk19DX4BQhWfYLwB4hST5hlJbQeW3_H91Dy2',
  };
  await admin.messaging().send(message);
});
