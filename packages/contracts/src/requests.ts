import {z} from 'zod';

export const incidentCategorySchema = z.enum([
  'TRAFFIC_ACCIDENT',
  'FIRE',
  'MEDICAL',
  'DROWNING',
  'NATURAL_DISASTER',
  'CRIME',
  'OTHER',
]);
export type IncidentCategory = z.infer<typeof incidentCategorySchema>;

/** POST /v1/requests (raiseSos, LLD section 4). */
export const raiseSosSchema = z.object({
  idempotencyKey: z.uuid(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracyM: z.number().nonnegative().max(5000),
    capturedAt: z.number().int(),
    address: z.string().max(300).optional(),
  }),
  category: incidentCategorySchema.optional(),
  severity: z.number().int().min(1).max(5).optional(),
  description: z.string().max(1000).optional(),
});
export type RaiseSosBody = z.infer<typeof raiseSosSchema>;

export type RaiseSosResponse = {
  requestId: string;
  status: string;
};
