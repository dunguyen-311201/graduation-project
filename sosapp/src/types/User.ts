import {EUser} from './../enums/EUser';
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
}
