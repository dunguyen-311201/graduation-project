import {Location} from '@types';
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

export type useLocationProps = {
  location: Location;
  setLocation: (location: Location) => void;
};

export const useLocation = create<useLocationProps>()(
  devtools(
    persist(
      set => ({
        location: {
          latitude: 0,
          longitude: 0,
        },
        setLocation: (location: Location) => {
          set({
            location,
          });
        },
      }),
      {
        name: 'location-storage',
      },
    ),
  ),
);
