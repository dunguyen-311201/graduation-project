/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const geolib = require("geolib");

const uuid = require("uuid");

const DES = require("./descriptions.json");

const img =
  "https://firebasestorage.googleapis.com/v0/b/sosapp-386606.appspot.com/o/Group%203.png?alt=media&token=84308e18-de03-40f8-9124-aaf83c25f240";

const {
  MESSAGE_PENDING,
  MESSAGE_IN_PROGRESS,
  MESSAGE_COMPLETED,
  USER_AVAILABLdatabaseE,
  USER_BUSY,
  USER_UNAVAILABLE,
  REGISTRATION_APPROVED,
  USER_AVAILABLE,
  USER_FREE,
  MESSAGE_EXRIPED,
  ROUTE_NOTIFICATIONS,
  ROUTE_USERS,
  ROUTE_MESSAGES,
  ROLE_CENTER,
  ROLE_WORKER,
  ROUTE_ASSIGNS,
} = require("./constant");

const serviceAccount = require("./sosapp-386606-firebase-adminsdk-qd8q5-2a3ae2a35c.json");
const { user } = require("firebase-functions/v1/auth");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sosapp-386606-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();

app.use(cors({ origin: true }));

const messColection = db.collection(ROUTE_MESSAGES);
const userColection = db.collection(ROUTE_USERS);
const assignColection = db.collection(ROUTE_ASSIGNS);
const notifyColection = db.collection(ROUTE_NOTIFICATIONS);

app.post(`/${ROUTE_USERS}/new-worker`, async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const displayName = req.body.displayName;
    const centerID = req.body.centerID;

    const newUser = await admin
      .auth()
      .createUser({ email, password, displayName });

    const id = newUser.uid;

    const data = {
      centerID,
      status: USER_UNAVAILABLE,
      role: "worker",
      displayName,
      email,
      disabled: false,
    };

    await db.doc(ROUTE_USERS + "/" + id).set(data);

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});

exports.app = functions.https.onRequest(app);

exports.newRequest = functions.firestore
  .document(`${ROUTE_MESSAGES}/{id}`)
  .onCreate(async (snap, context) => {
    try {
      const id = context.params.id;
      const { location, type, userID } = snap.data();

      const user = (await userColection.doc(userID).get()).data();

      // Handle Create
      const tokens = [];
      const ids = [];
      let notification, message;

      const batch = db.batch();

      const listUsers = await userColection
        .where("role", "==", "center")
        .where("status", "==", USER_AVAILABLE)
        .get();

      const docs = listUsers.docs;

      let row;

      docs.forEach((doc) => {
        row = doc.data();

        if (
          row.lastLogin !== null &&
          row.location.city === location.city &&
          geolib.isPointWithinRadius(
            { ...row.location },
            { ...location },
            10000
          )
        ) {
          tokens.push(row.token);
          ids.push(doc.id);
        }
      });

      if (tokens.length === 0) {
        notification = {
          title: type,
          body: "There is no rescue service ready to save you!",
          data: { id },
          time: Date.now(),
          userID,
        };

        message = {
          notification: {
            body: "There is no rescue service ready to save you!",
            title: "RESCUE REQUEST",
            imageUrl: img,
          },
          data: { id },
          token: user.token,
        };

        batch.update(messColection.doc(id), { status: MESSAGE_EXRIPED });

        await batch.commit();
        await admin.messaging().send(message);

        return null;
      }

      message = {
        notification: {
          body: `${user.displayName} ${DES[type]}`,
          title: type,
          imageUrl: img,
        },
        data: { id },
        tokens,
      };

      batch.update(userColection.doc(userID), { status: USER_BUSY });

      /////
      // save notification all services
      ///////

      notification = {
        title: "REQUEST RESCUE",
        body: `${user.displayName} ${DES[type]}`,
        data: { id },
        time: Date.now(),
      };

      const updates = [];

      ids.forEach((id) => {
        const docRef = notifyColection.doc();
        batch.create(docRef, { ...notification, userID: id });
        updates.push(docRef);
      });

      //////

      await admin.messaging().sendEachForMulticast(message);

      await batch.commit();

      /////// Handle Timeout

      const timeout = 10000 * 60;

      const timeID = setTimeout(async () => {
        const batch = db.batch();
        const mess = (await messColection.doc(id).get()).data();

        if (mess && mess.status === MESSAGE_PENDING) {
          notification = {
            title: type,
            body: "There is no rescue service ready to save you!",
            data: { id },
            time: Date.now(),
          };

          message = {
            notification: {
              body: "There is no rescue service ready to save you!",
              title: "RESCUE REQUEST",
              imageUrl: img,
            },
            data: { id },
            token: user.token,
          };

          batch.update(messColection.doc(id), { status: MESSAGE_EXRIPED });
          batch.update(userColection.doc(userID), { status: USER_FREE });

          updates.forEach((ref) => {
            batch.delete(ref);
          });

          const docRefU = notifyColection.doc();
          batch.create(docRefU, { ...notification, userID });

          await admin.messaging().send(message);
          await batch.commit();
        }

        return () => {
          clearTimeout(timeID);
          return null;
        };
      }, timeout);
    } catch (error) {}

    return null;
  });

exports.handleRequest = functions.firestore
  .document(`${ROUTE_MESSAGES}/{id}`)
  .onUpdate(async (snap, context) => {
    try {
      const id = context.params.id;
      const { status, userID, type, workerID, userCompleted, distance } =
        snap.after.data();

      const user = (await db.doc(ROUTE_USERS + "/" + userID).get()).data();
      const worker = (await db.doc(ROUTE_USERS + "/" + workerID).get()).data();
      const service = (
        await db.doc(ROUTE_USERS + "/" + worker.centerID).get()
      ).data();

      if (user && worker && service && status) {
        const ids = [];
        const tokens = [];
        let actual;
        let name;

        if (service.lastLogin) {
          tokens.push(service.token);
        }

        ids.push(worker.centerID);

        if (userCompleted === userID) {
          if (worker.lastLogin) {
            tokens.push(worker.token);
            name = user.displayName;
          }

          ids.push(workerID);
        } else {
          if (user.lastLogin) {
            tokens.push(user.token);
            name = worker.displayName;
          }

          ids.push(userID);
        }

        const batch = db.batch();

        const countWorkerInAvailableCenter = (
          await userColection
            .where("centerID", "==", worker.centerID)
            .where("status", "==", USER_FREE)
            .count()
            .get()
        ).data().count;

        if (status === MESSAGE_IN_PROGRESS) {
          if (countWorkerInAvailableCenter === 0) {
            batch.update(userColection.doc(worker.centerID), {
              status: USER_UNAVAILABLE,
            });
          }

          batch.update(messColection.doc(id), {
            workerID,
            centerID: worker.centerID,
          });

          ////
          //// handle update assignment

          const assignID = (
            await db
              .collection(ROUTE_ASSIGNS)
              .where("workerID", "==", workerID)
              .where("status", "==", MESSAGE_PENDING)
              .get()
          ).docs.at(0).id;

          batch.update(assignColection.doc(assignID), {
            status: MESSAGE_IN_PROGRESS,
          });

          ////

          actual = "comfirmed the request!";
        } else {
          let time = worker.time || 0;
          let wDistance = worker.distance || 0;
          if (worker.startAt) {
            time = time + (Date.now() - worker.startAt) / 1000;
          }

          wDistance = wDistance + distance;

          batch.update(userColection.doc(userID), { status: USER_FREE });

          ////
          //// handle update assignment

          const assignID = (
            await db
              .collection(ROUTE_ASSIGNS)
              .where("workerID", "==", workerID)
              .where("status", "==", MESSAGE_IN_PROGRESS)
              .get()
          ).docs.at(0).id;

          batch.update(assignColection.doc(assignID), {
            status: MESSAGE_COMPLETED,
          });

          ////

          await db.doc(ROUTE_USERS + "/" + workerID).update({
            status: USER_FREE,
            startAt: null,
            time,
            distance: wDistance,
          });

          if (service.status === USER_UNAVAILABLE) {
            batch.update(userColection.doc(worker.centerID), {
              status: USER_AVAILABLE,
            });
          }

          actual = "has confirmed the request has been completed!";
        }

        const message = {
          notification: {
            body: `${name} ${actual}`,
            title: "NOTIFICATION",
            imageUrl: img,
          },
          data: { id },
          tokens,
        };

        const notification = {
          body: `${name} ${actual}`,
          title: type,
          data: { id },
          time: Date.now(),
        };

        ids.forEach((id) => {
          const docRef = notifyColection.doc();
          batch.create(docRef, { ...notification, userID: id });
        });

        /////////

        await batch.commit();

        await admin.messaging().sendEachForMulticast(message);
      }
    } catch (error) {}
    return null;
  });

exports.serviceAssign = functions.firestore
  .document(`${ROUTE_ASSIGNS}/{id}`)
  .onCreate(async (snap, context) => {
    const id = context.params.id;
    const { workerID, messID } = snap.data();

    try {
      if (workerID && messID) {
        const mess = (await db.doc(ROUTE_MESSAGES + "/" + messID).get()).data();
        const worker = (
          await db.doc(ROUTE_USERS + "/" + workerID).get()
        ).data();

        let notification = {
          title: mess.type,
          data: { id: messID, tID: id },
          body: "You are assigned to rescue from the center.",
          time: Date.now(),
          userID: workerID,
        };

        const docRef = await notifyColection.add(notification);

        let message = {
          notification: {
            body: "You are assigned to rescue from the center.",
            title: mess.type,
            imageUrl: img,
          },
          data: { id: messID, tID: id },
          token: worker.token,
        };

        await admin.messaging().send(message);

        const timeout = 1000 * 60;

        const timeID = setTimeout(async () => {
          const assign = await (await assignColection.doc(id).get()).data();

          if (assign.status === MESSAGE_PENDING) {
            const center = (
              await userColection.doc(worker.centerID).get()
            ).data();

            await docRef.delete();

            message = {
              notification: {
                body: "Not Found " + worker.displayName + " response!",
                title: mess.type,
                imageUrl: img,
              },
              data: { id: messID },
              token: center.token,
            };

            notification = {
              title: mess.type,
              data: { id: messID },
              body: "Not Found " + worker.displayName + " response!",
              time: Date.now(),
              userID: worker.centerID,
            };

            await notifyColection.add(notification);

            await admin.messaging().send(message);
          }

          return () => {
            clearTimeout(timeID);
            return null;
          };
        }, timeout);
      }
    } catch (error) {}

    return null;
  });

exports.workerReject = functions.firestore
  .document(`${ROUTE_ASSIGNS}/{id}`)
  .onUpdate(async (snap, context) => {
    try {
      const { status, workerID, messID } = snap.after.data();

      // reject rescue of worker
      if (status === "reject") {
        const worker = (
          await db.doc(ROUTE_USERS + "/" + workerID).get()
        ).data();
        if (worker) {
          const { displayName, centerID } = worker;

          const center = (
            await db.doc(ROUTE_USERS + "/" + centerID).get()
          ).data();

          if (center) {
            const message = {
              notification: {
                body: displayName + " rejected assign",
                title: "REJECT ASSIGN",
                imageUrl: img,
              },
              token: center.token,
              data: { id: messID },
            };

            const notification = {
              body: displayName + " rejected assign",
              title: "REJECT ASSIGN",
              time: Date.now(),
              data: { id: messID },
              userID: centerID,
            };

            await userColection
              .doc(workerID)
              .update({ status: USER_UNAVAILABLE });

            await notifyColection.add(notification);
            await admin.messaging().send(message);
          }
        }
      }
    } catch (error) {}
    return null;
  });

exports.deleteRequest = functions.firestore
  .document(`${ROUTE_MESSAGES}/{id}`)
  .onDelete(async (snap, context) => {
    const { userID } = snap.data();

    await db.doc(ROUTE_USERS + "/" + userID).update({ status: USER_FREE });

    return null;
  });

exports.workers = functions.firestore
  .document(`${ROUTE_USERS}/{id}`)
  .onDelete(async (snap, context) => {
    const { centerID } = snap.data();
    const id = context.params.id;
    await auth.deleteUser(id);

    const cSnap = await db
      .collection(ROUTE_USERS)
      .where("centerID", "==", centerID)
      .where("status", "==", "free")
      .count()
      .get();

    if (cSnap.data().count === 0) {
      await docCenter.update({ status: USER_UNAVAILABLE });
    }

    return null;
  });

exports.signIn = functions.firestore
  .document(`${ROUTE_USERS}/{id}`)
  .onUpdate(async (snap, context) => {
    try {
      const { role, centerID, lastLogin, status } = snap.after.data();

      if (role === "worker" && centerID) {
        const docCenter = db.doc(ROUTE_USERS + "/" + centerID);
        const center = (await docCenter.get()).data();

        if (
          center &&
          lastLogin &&
          status === USER_FREE &&
          center.lastLogin &&
          center.status === USER_UNAVAILABLE
        ) {
          await docCenter.update({ status: USER_AVAILABLE });
        }
      }
    } catch (error) {}
    return null;
  });

// exports.signUp = functions.firestore
//   .document(`${ROUTE_USERS}/{id}`)
//   .onCreate(async (snap, context) => {
//     try {
//       const { role, centerID, displayName } = snap.data();
//       const id = context.params.id;

//       if (centerID) {
//        admin.auth().createUser({displayName, uid:id,email: })
//       }
//     } catch (error) {
//       console.log(598, error);
//     }
//     return null;
//   });
