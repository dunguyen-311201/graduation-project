import { Logger } from "@nestjs/common";
import type { App } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import type { Notifier, PushMessage } from "../../application/ports.js";

const STALE_TOKEN_ERRORS = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

type SendResult = { success: boolean; error?: { code: string } };

/** Tokens FCM will never deliver to again, so they can be dropped. */
export function staleTokens(tokens: string[], results: SendResult[]): string[] {
  return tokens.filter((_, i) => {
    const code = results[i]?.error?.code;
    return code !== undefined && STALE_TOKEN_ERRORS.has(code);
  });
}

/** Push never fails a command: the state change has already committed. */
export class FcmNotifier implements Notifier {
  private readonly logger = new Logger(FcmNotifier.name);

  constructor(private readonly app: App) {}

  async push(uids: string[], message: PushMessage) {
    await Promise.all(uids.map((uid) => this.pushToUser(uid, message)));
  }

  private async pushToUser(uid: string, message: PushMessage) {
    try {
      const ref = getFirestore(this.app).doc(`users/${uid}`);
      const tokens = ((await ref.get()).get("fcmTokens") ?? []) as string[];
      if (tokens.length === 0) return;

      const { responses } = await getMessaging(this.app).sendEachForMulticast({
        tokens,
        notification: { title: message.title, body: message.body },
        data: message.data,
      });

      const stale = staleTokens(tokens, responses);
      if (stale.length > 0) await ref.update({ fcmTokens: FieldValue.arrayRemove(...stale) });
    } catch (error) {
      this.logger.error(`Push to ${uid} failed`, error);
    }
  }
}
