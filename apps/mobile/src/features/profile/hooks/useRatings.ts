import {useCallback} from 'react';

import useDeviceStore from './useDeviceStore';

export type RescueRating = {stars: number; comment: string; time: number};

// Kept on the device until the API has an endpoint for ratings
// (requests/{id} is written only by the NestJS API).
const useRatings = () => {
  const {value: ratings, save, ready} = useDeviceStore<
    Record<string, RescueRating>
  >('rescue-ratings', {});

  const rate = useCallback(
    (requestId: string, stars: number, comment: string) =>
      save({...ratings, [requestId]: {stars, comment, time: Date.now()}}),
    [ratings, save],
  );

  return {ratings, rate, ready};
};

export default useRatings;
