import {z} from 'zod';

/** POST /v1/responders (CTR-02). The center is always the caller. */
export const createResponderSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  email: z.email(),
  password: z.string().min(6).max(128),
});
export type CreateResponderBody = z.infer<typeof createResponderSchema>;

export type CreateResponderResponse = {
  responderId: string;
};
