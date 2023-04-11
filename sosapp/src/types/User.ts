import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface Roles {
  user: boolean;
  author?: boolean;
  admin?: boolean;
}

export class UserProfile implements FirebaseAuthTypes.UserCredential {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: Roles;
  additionalUserInfo?: FirebaseAuthTypes.AdditionalUserInfo | undefined;
  user: FirebaseAuthTypes.User;

  constructor(user: FirebaseAuthTypes.User) {
    this.user = user;
  }
}
