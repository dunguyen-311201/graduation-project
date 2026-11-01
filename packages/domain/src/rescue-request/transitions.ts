export const REQUEST_STATUSES = [
  'PENDING',
  'CLAIMED',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** The edges of the state machine in LLD section 3 (INV-05). */
export const TRANSITIONS: Readonly<Record<RequestStatus, readonly RequestStatus[]>> = {
  PENDING: ['CLAIMED', 'EXPIRED', 'CANCELLED'],
  CLAIMED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CLAIMED', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export const canTransition = (from: RequestStatus, to: RequestStatus) =>
  TRANSITIONS[from].includes(to);

/** INV-01: a requester has at most one request in one of these states. */
export const isActive = (status: RequestStatus) => TRANSITIONS[status].length > 0;
