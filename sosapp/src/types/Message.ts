import {Location} from './Location';

export type TStatus = 'pending' | 'in progress' | 'completed' | 'expired';

export type TMessage = {
  description: string;
  type: string;
  status: TStatus;
  id: string;
  userID: string;
  location: Location | null;
  onView?: () => void;
  onQuit?: () => void;
  workerID?: string;
  startAt?: number;
  endAt?: number;
  time: number;
};
