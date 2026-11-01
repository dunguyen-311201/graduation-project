import {z} from 'zod';

/** PUT /v1/me/fcm-token: registers this device for push notifications. */
export const registerFcmTokenSchema = z.object({
  token: z.string().trim().min(1).max(4096),
});
export type RegisterFcmTokenBody = z.infer<typeof registerFcmTokenSchema>;
