var admin = require('firebase-admin');

async function onUserPictureLiked(ownerId: string, userId: string) {
  const owner = admin.firestore().collection('users').doc(ownerId).get();

  const user = admin.firestore().collection('users').doc(userId).get();

  console.log(owner, user);

  await admin.messaging().sendToDevice(
    owner.tokens,
    {
      data: {
        owner: JSON.stringify(owner),
        user: JSON.stringify(user),
      },
    },
    {
      contentAvailable: true,
      priority: 'high',
    },
  );
}

export {onUserPictureLiked};
