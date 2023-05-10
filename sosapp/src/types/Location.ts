import {TAddress} from './User';

export type Location = {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  altitudeAccuracy?: number;
  description?: TAddress;
};
