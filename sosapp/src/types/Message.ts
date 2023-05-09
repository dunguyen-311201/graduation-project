import {Location} from './Location';

export type TMessage = {
  description: string;
  type: string;
  status?: string;
  uid: string;
  location?: Location | null;
};
