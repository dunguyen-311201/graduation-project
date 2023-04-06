import {create} from 'zustand';
import auth from '@react-native-firebase/auth';

export const useAuth = create(() => ({
  user: auth().currentUser,
  isAuthenticated: auth().currentUser !== null,
  signupByPhone: async (phone: string) => {
    const confirmation = await auth().signInWithPhoneNumber(phone);
    return confirmation;
  },
  logout: async () => {
    await auth().signOut();
  },
}));
