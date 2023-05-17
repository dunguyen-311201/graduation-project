const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const uuid = require("uuid");

const DES = require("./descriptions.json");

// eslint-disable-next-line max-len, no-var
const serviceAccount = require("./sosapp-384004-firebase-adminsdk-1gd4d-6de15cd9f0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sosapp-384004-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const rdb = admin.database();

const app = express();
app.use(cors({ origin: true }));

const pushNotifications = async ({ tokens, type, data, user }) => {
  const message = {
    notification: {
      title: type,
      body: `${user} ${DES[type]}`,
      imageUrl: "https://static.invertase.io/assets/React-Native-Firebase.svg",
    },
    tokens,
    data,
  };

  console.log(36, message);

  await admin.messaging().sendEachForMulticast(message);
};

// post request
app.post("/messages", (req, res) => {
  (async () => {
    try {
      // generate uid message
      const uid = uuid.v4();

      // get id user send message
      const userId = req.body.userId;

      // save message real time database
      const m = {
        ...req.body,
        status: "pending",
        time: new Date().toUTCString(),
        uid,
      };

      const ref = rdb.ref("/messages/" + uid);

      await ref.set(m);

      // get  users
      const tokens = [];
      let data;

      const users = (await db.collection("users").get()).docs;

      // filter tokens of users logged and different user send messages
      users.forEach((doc) => {
        data = doc.data();
        if (
          data.lastLogin !== null &&
          data.uid !== userId &&
          data.location?.description?.city ===
            req.body.location.description.city
        ) {
          tokens.push(doc.data().token);
        }
      });

      // filter info user send messages
      const user = users.find((item) => item.data().uid === userId).data();

      if (user && tokens.length > 0) {
        await pushNotifications({
          data: { uid },
          tokens,
          type: req.body.type,
          user: `${user.firstName} ${user.lastName}`,
        });
      }

      // subscribe to notifications when message status changes
      ref.on("value", async (snap) => {
        const mess = snap.val();
        // push notification Service Rescue and User Emergency
        const tokens = [];
        if (mess.status !== "pending") {
          const { serviceId } = mess;
          if (user) {
            tokens.push(user.token);
          }

          if (serviceId) {
            const { token } = (await db.doc("users/" + serviceId).get()).data();
            if (token) tokens.push(token);
          }
        }

        // unsubcribe message change
        if (mess.status === "complete") {
          ref.off("value");
        }

        if (tokens.length > 0) {
          await pushNotifications({
            data: { uid },
            tokens,
            type: req.body.type,
            user: `${user.firstName} ${user.lastName}`,
          });
        }
      });

      return res.status(201).send({ uid });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  })();
});

exports.app = functions.https.onRequest(app);
