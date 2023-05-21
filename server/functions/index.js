const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const uuid = require("uuid");

const DES = require("./descriptions.json");

const {
  MESSAGE_COMPLETED,
  MESSAGE_PENDING,
  MESSAGE_IN_PROGRESS,
} = require("./constant");

// eslint-disable-next-line max-len
const serviceAccount = require("./sosapp-386606-firebase-adminsdk-qd8q5-2a3ae2a35c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sosapp-386606-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const rdb = admin.database();

const app = express();
app.use(cors({origin: true}));

// post request
app.post("/messages", (req, res) => {
  (async () => {
    try {
      const services = [];
      // generate uid message
      const uid = uuid.v4();

      // save message real time database
      const userId = req.body.userId;

      const m = {
        ...req.body,
        status: MESSAGE_PENDING,
        time: new Date().toUTCString(),
        uid,
      };

      // get  users
      const tokens = [];
      let data;

      const users = (await db.collection("users").get()).docs;

      // filter tokens of users logged and different user send messages
      users.forEach((doc) => {
        data = doc.data();
        if (
          data.uid !== userId &&
          data.lastLogin &&
          data.location &&
          req.body.location &&
          req.body.location.city &&
          req.body.location.city === data.location.city
        ) {
          tokens.push(data.token);
          services.push(data.uid);
        }
      });

      console.log({tokens});

      services.push(userId);

      // await db.doc("messages/"+uid).set(m);
      await rdb.ref("/messages/" + uid).set(m);

      await rdb.ref("/message-users/" + uid).set(services);

      await Promise.all(
          services.map(async (item) => {
            await rdb.ref("/user-messages/" + item + "/0/" + uid).set(1);
          }),
      );

      // filter info user send messages
      const user = users.find((item) => item.data().uid === userId).data();

      if (user && tokens.length > 0) {
        const message = {
          notification: {
            title: req.body.type,
            body: `${user.firstName} ${user.lastName} ${DES[req.body.type]}`,
            imageUrl:
              "https://static.invertase.io/assets/React-Native-Firebase.svg",
          },
          tokens,
          data: {uid, userId},
        };

        await admin.messaging().sendEachForMulticast(message);
      }

      return res.status(201).send({uid, userId});
    } catch (error) {
      console.log(error);
      return res.status(400).send({error});
    }
  })();
});

app.get("/messages/:uid", (req, res) => {
  (async () => {
    try {
      const uid = req.params.uid;

      const ref = rdb.ref("/messages/" + uid);
      const message = (await ref.get()).val();

      if (message) {
        return res.status(200).send(message);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

app.put("/messages/:uid", (req, res) => {
  (async () => {
    try {
      const uid = req.params.uid;
      const cStatus = req.body.status;
      const cDescription = req.body.description;
      const cType = req.body.type;
      const cServiceId = req.body.serviceId;

      const ref = rdb.ref("/messages/" + uid);

      const message = (await ref.get()).val();

      const {userId, serviceId, type, status, description} = message || {};

      let service;
      let data;

      if (cDescription && cDescription !== description) {
        data = {...data, description: cDescription};
      }

      if (cStatus && cStatus !== status) {
        data = {...data, status: cStatus};
      }

      if (cServiceId && cServiceId !== serviceId) {
        data = {...data, serviceId: cServiceId};
      }

      if (cType && cType !== type) {
        data = {...data, type: cType};
      }

      const user = (await db.doc("users/" + userId).get()).data();

      if (data && user) {
        if (status === MESSAGE_PENDING && cStatus === MESSAGE_IN_PROGRESS) {
          // list users recive requests
          const mu0s = (await rdb.ref("/message-users/" + uid).get()).val();
          // mu0s = mu0s.filter((item) => item!== cServiceId);
          await Promise.all(
              mu0s.map(async (key) => {
                await rdb.ref("/user-messages/" + key + "/0/" + uid).remove();
              }),
          );
          await rdb.ref("/message-users/" + uid).remove();

          await rdb.ref("/user-messages/" + cServiceId + "/1/" + uid).set(1);
          await rdb.ref("/user-messages/" + userId + "/1/" + uid).set(1);

          await ref.update(data);

          service = (await db.doc("users/" + cServiceId).get()).data();
          const {firstName, lastName} = service;

          await admin.messaging().send({
            token: user.token,
            data: {uid, userId},
            notification: {
              body: `${firstName} ${lastName} confirmed to save you!`,
            },
          });
        } else if (
          status === MESSAGE_IN_PROGRESS &&
          cStatus === MESSAGE_COMPLETED
        ) {
          await ref.update(data);
          service = (await db.doc("users/" + serviceId).get()).data();
          const {firstName, lastName} = service;

          await admin.messaging().send({
            token: user.token,
            data: {uid, userId},
            notification: {
              body:
                `${firstName} ${lastName}` +
                " successful rescue has been confirmed!",
            },
          });
        }
        return res.status(200).send(data);
      } else {
        return res.sendStatus(400);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
