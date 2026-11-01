// Seeds the LLD `centers` and `responders` documents and custom claims for the
// dev test accounts. Safe to run again.
//
//   GOOGLE_APPLICATION_CREDENTIALS=<key file> node services/api/scripts/seed-dev.mjs
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({ credential: applicationDefault(), projectId: "sos-app-dev-b1963" });
const auth = getAuth(app);
const db = getFirestore(app);

const center = await auth.getUserByEmail("center_test@sosapp.com");
const worker = await auth.getUserByEmail("worker_test@sosapp.com");

await db.doc(`centers/${center.uid}`).set({
  name: "Test Center",
  address: "Lien Chieu, Da Nang",
  location: { lat: 16.0748, lng: 108.1497 },
  geohash: "",
  registrationStatus: "APPROVED",
  availableResponders: 1,
  dispatcherIds: [center.uid],
  phone: "",
  licenseNo: "TEST",
  version: 1,
});

await db.doc(`responders/${worker.uid}`).set({
  centerId: center.uid,
  displayName: "Test Worker",
  availability: "AVAILABLE",
  currentAssignmentId: null,
  disabled: false,
  stats: { missions: 0, totalDistanceM: 0, totalDurationS: 0 },
  version: 1,
});

await auth.setCustomUserClaims(center.uid, { role: "dispatcher", centerId: center.uid });
await auth.setCustomUserClaims(worker.uid, { role: "responder", centerId: center.uid });

console.log("Seeded one center and one responder.");
