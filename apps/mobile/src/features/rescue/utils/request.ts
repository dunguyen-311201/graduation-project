import type {IncidentCategory, RaiseSosBody} from '@sos/contracts';
import {Location, TMessage, TStatus} from '@types';

type RequestDoc = {
  requesterId: string;
  responderId?: string | null;
  status: string;
  category: IncidentCategory;
  description?: string;
  createdAt: number;
  location: RaiseSosBody['location'];
};

const STATUS: Record<string, TStatus> = {
  PENDING: 'pending',
  CLAIMED: 'pending',
  ASSIGNED: 'pending',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
  CANCELLED: 'expired',
  EXPIRED: 'expired',
};

const CATEGORY_BY_TYPE: Record<string, IncidentCategory> = {
  'Traffic incident report': 'TRAFFIC_ACCIDENT',
  'Emergency support request': 'MEDICAL',
};

const TYPE_BY_CATEGORY: Partial<Record<IncidentCategory, string>> = {
  TRAFFIC_ACCIDENT: 'Traffic incident report',
  MEDICAL: 'Emergency support request',
};

// The API owns `requests`; screens keep working with TMessage for now.
export const toMessage = (id: string, data: RequestDoc): TMessage => ({
  id,
  userID: data.requesterId,
  workerID: data.responderId ?? undefined,
  status: STATUS[data.status] ?? 'expired',
  stage: data.status,
  type: TYPE_BY_CATEGORY[data.category] ?? 'Rescue request',
  description: data.description ?? '',
  time: data.createdAt,
  location: {
    latitude: data.location.lat,
    longitude: data.location.lng,
    description: data.location.address,
    city: data.location.address,
  },
});

export const toRaiseSosBody = (
  idempotencyKey: string,
  mess: {type?: string; description?: string; location: Location | null},
): RaiseSosBody => ({
  idempotencyKey,
  location: {
    lat: mess.location?.latitude ?? 0,
    lng: mess.location?.longitude ?? 0,
    accuracyM: mess.location?.accuracy ?? 0,
    capturedAt: Date.now(),
    address: mess.location?.description,
  },
  category: CATEGORY_BY_TYPE[mess.type ?? ''] ?? 'OTHER',
  description: mess.description,
});

// Hermes has no crypto.randomUUID. Only used to spot a repeated send.
export const newIdempotencyKey = () =>
  'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
