import {useCallback} from 'react';

import {Location} from '@types';
import useDeviceStore from './useDeviceStore';

export type PlaceKind = 'home' | 'work';
export type SavedPlaces = Partial<Record<PlaceKind, Location>>;

export const PLACE_LABEL: Record<PlaceKind, string> = {
  home: 'Home',
  work: 'Work',
};

const useSavedPlaces = () => {
  const {value: places, save, ready} = useDeviceStore<SavedPlaces>(
    'saved-places',
    {},
  );

  const setPlace = useCallback(
    (kind: PlaceKind, location: Location | null) => {
      const next = {...places};
      if (location) {
        next[kind] = location;
      } else {
        delete next[kind];
      }
      return save(next);
    },
    [places, save],
  );

  return {places, setPlace, ready};
};

export default useSavedPlaces;
