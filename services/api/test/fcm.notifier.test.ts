import { describe, expect, it } from "vitest";
import { staleTokens } from "../src/infrastructure/firebase/fcm.notifier.js";

describe("staleTokens", () => {
  it("keeps delivered tokens and tokens that failed for a temporary reason", () => {
    const results = [
      { success: true },
      { success: false, error: { code: "messaging/internal-error" } },
      { success: false, error: { code: "messaging/registration-token-not-registered" } },
      { success: false, error: { code: "messaging/invalid-registration-token" } },
    ];
    expect(staleTokens(["ok", "retry", "gone", "bad"], results)).toEqual(["gone", "bad"]);
  });
});
