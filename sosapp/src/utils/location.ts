import {Location, TAddress} from '@types';
import Config from 'react-native-config';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const getLocationDetails = async ({latitude, longitude}: Location) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
  );

  const data = await res.json();
  const result = data.results.find(
    (item: any) => item.address_components.length === 3,
  );

  if (result) {
    const components = result.address_components;

    const district = components[0].long_name;
    const city = components[1].long_name;
    const nation = components[2].long_name;

    const address: TAddress = {
      district,
      city,
      nation,
      more: result.formatted_address,
    };

    return address;
  }
};

export {getLocationDetails};
