export type TNotify = {
  title: string;
  body: string;
  onClose: () => void;
  onPress: () => void;
};

export type TNotification = {
  id: string;
  title: string;
  data?: any;
  time: number;
  body: string;
  imageUrl?: string;
  background?: boolean;
  onReject?: () => Promise<void>;
};
