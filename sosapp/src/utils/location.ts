import {Location} from '@types';
import Config from 'react-native-config';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const getLocationDetails = async ({latitude, longitude}: Location) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${GOOGLE_MAPS_API_KEY}`,
  );

  const data = await res.json();
  return data;
};

export {getLocationDetails};
