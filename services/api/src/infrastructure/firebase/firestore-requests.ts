import { ErrorCode } from "@sos/contracts";
import { isActive } from "@sos/domain";
import type { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { ConflictError, NotFoundError } from "../../application/errors.js";
import type { CenterDirectory, RequestRepository, RescueRequestRecord } from "../../application/ports.js";

export class FirestoreRequestRepository implements RequestRepository {
  constructor(private readonly app: App) {}

  private get db() {
    return getFirestore(this.app);
  }

  newId() {
    return this.db.collection("requests").doc().id;
  }

  async findByIdempotencyKey(requesterId: string, key: string) {
    const snap = await this.db
      .collection("requests")
      .where("requesterId", "==", requesterId)
      .where("idempotencyKey", "==", key)
      .limit(1)
      .get();
    return (snap.docs[0]?.data() as RescueRequestRecord | undefined) ?? null;
  }

  /** INV-01: the `activeRequests` lock makes two concurrent raises conflict. */
  async create(record: RescueRequestRecord) {
    const lock = this.db.doc(`activeRequests/${record.requesterId}`);
    await this.db.runTransaction(async (tx) => {
      if ((await tx.get(lock)).exists) {
        throw new ConflictError(ErrorCode.ACTIVE_REQUEST_EXISTS, "You already have an active request");
      }
      tx.set(lock, { requestId: record.id, createdAt: record.createdAt });
      tx.create(this.db.doc(`requests/${record.id}`), record);
    });
  }

  async update(id: string, change: (record: RescueRequestRecord) => RescueRequestRecord | null) {
    const ref = this.db.doc(`requests/${id}`);
    return this.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new NotFoundError(ErrorCode.REQUEST_NOT_FOUND, "Request not found");

      const current = snap.data() as RescueRequestRecord;
      const next = change(current);
      if (!next) return null;

      const updated = { ...next, version: current.version + 1 };
      tx.set(ref, updated);
      if (!isActive(updated.status)) tx.delete(this.db.doc(`activeRequests/${updated.requesterId}`));
      return updated;
    });
  }
}

export class FirestoreCenterDirectory implements CenterDirectory {
  constructor(private readonly app: App) {}

  async listApproved() {
    const snap = await getFirestore(this.app).collection("centers").where("registrationStatus", "==", "APPROVED").get();
    return snap.docs.map((doc) => {
      const { location, availableResponders, dispatcherIds } = doc.data();
      return { id: doc.id, location, availableResponders, dispatcherIds };
    });
  }
}
