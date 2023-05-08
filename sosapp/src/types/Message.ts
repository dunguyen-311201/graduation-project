import {Location} from './Location';

export type TMessage = {
  description: string;
  type: string;
  uid: string;
  location?: Location;
};
