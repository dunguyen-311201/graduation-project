import {EUser} from './../enums/EUser';
import {Location} from './Location';
export interface Roles {
  user: boolean;
  author?: boolean;
  admin?: boolean;
}

export interface TUser {
  [EUser.first]?: string;
  [EUser.last]?: string;
  [EUser.role]?: Roles;
  [EUser.uid]?: string;
  [EUser.email]?: string;
  [EUser.phoneNumber]?: string;
  [EUser.photoURL]?: string;
  [EUser.token]?: string;
  [EUser.isAuthenticated]?: boolean;
  [EUser.location]?: Location;
}
