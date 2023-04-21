import {TUser} from './User';

export type TAuth = {
  isAuthenticated: boolean;
} & TUser;
