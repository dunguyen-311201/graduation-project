/** Error body returned by the API for every 4xx/5xx (LLD §4). */
export type ApiError = {
  statusCode: number;
  /** Stable machine-readable code, e.g. EMAIL_EXISTS. */
  code?: string;
  message: string;
};

export const ErrorCode = {
  NOT_A_DISPATCHER: 'NOT_A_DISPATCHER',
  CENTER_NOT_APPROVED: 'CENTER_NOT_APPROVED',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_A_REQUESTER: 'NOT_A_REQUESTER',
  NOT_OWNER: 'NOT_OWNER',
  ACTIVE_REQUEST_EXISTS: 'ACTIVE_REQUEST_EXISTS',
  REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
  INVALID_TRANSITION: 'INVALID_TRANSITION',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
