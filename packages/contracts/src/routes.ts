/** API paths, relative to the API base URL. */
export const ApiRoute = {
  RESPONDERS: 'v1/responders',
  FCM_TOKEN: 'v1/me/fcm-token',
  REQUESTS: 'v1/requests',
  ASSIGNMENTS: 'v1/assignments',
  AVAILABILITY: 'v1/responders/me/availability',
} as const;
