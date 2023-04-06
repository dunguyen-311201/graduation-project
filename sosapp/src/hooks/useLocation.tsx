import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

export type Location = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type useLocationProps = {
  location: Location;
  setLocation: (location: Location) => void;
};

export const useLocation = create<useLocationProps>()(
  devtools(
    persist(
      set => ({
        location: {
          latitude: 16.0322432,
          longitude: 16.0322432,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        setLocation: (location: Location) => {
          set({location});
        },
      }),
      {
        name: 'location-storage',
      },
    ),
  ),
);
