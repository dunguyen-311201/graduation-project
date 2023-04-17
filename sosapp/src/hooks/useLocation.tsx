import AsyncStorage from '@react-native-async-storage/async-storage';
import {Location} from '@types';
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

export type useLocationProps = {
  location: Location;
  setLocation: (latitude: number, longitude: number, lable?: string) => void;
};

export const useLocation = create<useLocationProps>()(
  devtools(
    persist(
      set => ({
        location: {
          latitude: 0,
          longitude: 0,
        },
        setLocation: (latitude: number, longitude: number, lable?: string) => {
          set({
            location: {latitude, longitude, lable},
          });
        },
      }),
      {
        name: 'location-storage',
        getStorage: () => AsyncStorage,
      },
    ),
  ),
);
