export enum EUser {
  first = 'firstName',
  name = 'name',
  last = 'lastName',
  id = 'id',
  role = 'role',
  displayName = 'displayName',
  phoneNumber = 'phoneNumber',
  email = 'email',
  password = 'password',
  photoURL = 'photoURL',
  token = 'token',
  isAuthenticated = 'isAuthenticated',
  location = 'location',
  lastLogin = 'lastLogin',
  address = 'address',
  citizenIdentification = 'citizenIdentification',
  timeRegistration = 'timeRegistration',
  statusRegistration = 'statusRegistration',
  isActive = 'isActive',
  centerName = 'centerName',
  status = 'status',
  startAt = 'startAt',
  time = 'time',
  distance = 'distance',
  disabled = 'disabled',
}

export enum EStatusService {
  PENDING = 'pending',
  APPROVED = 'approved',
}

export enum EStatusUser {
  FREE = 'free',
  BUSY = 'busy',
}

export enum ERole {
  USER = 'user',
  CENTER = 'center',
  WORKER = 'worker',
}
