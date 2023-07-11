import {EUser} from '@enums';
import {Location} from './Location';

export interface Roles {
  user?: boolean;
  author?: boolean;
  admin?: boolean;
}

export type TAddress = {
  district?: string;
  city?: string;
  nation?: string;
  more?: string;
};

export type TRole = 'admin' | 'worker' | 'center' | 'user';

export interface TUser {
  [EUser.displayName]: string | null;
  [EUser.role]: TRole;
  [EUser.id]: string;
  [EUser.phoneNumber]: string | null;
  [EUser.photoURL]: string | null;
  [EUser.token]: string | null;
  [EUser.location]: Location | null;
  [EUser.status]: 'free' | 'busy' | 'available' | 'unavailable';
  [EUser.email]: string | null;
  [EUser.citizenIdentification]?: string;
  [EUser.isActive]?: boolean;
  [EUser.timeRegistration]?: number;
  [EUser.statusRegistration]?: 'pending' | 'approved';
  [EUser.centerName]?: string;
  [EUser.lastLogin]: number | null;
  [EUser.startAt]?: number;
  [EUser.time]?: number;
  [EUser.distance]?: number;
  [EUser.disabled]?: boolean;
}

export interface TUserUpgrade {
  [EUser.centerName]?: string;
  [EUser.id]?: string;
  [EUser.email]?: string | null;
  [EUser.phoneNumber]?: string;
  [EUser.location]: Location | null;
  [EUser.address]?: TAddress;
  [EUser.citizenIdentification]?: string;
}
