export type TTask = {
  id: string;
  messID: string;
  workerID: string;
  time: number;
  status: 'pending' | 'completed' | 'in progress';
};
