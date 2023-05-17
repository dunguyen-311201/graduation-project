import {MESSAGE_IN_PROGRESS} from '@constants';
import database from '@react-native-firebase/database';
import {TMessage} from '@types';

const comfirmMessage = async (uid: string) => {
  database()
    .ref('/messages/' + uid)
    .set({status: MESSAGE_IN_PROGRESS});
};

const getMessageById = async (uid: string) => {
  const val = (
    await database()
      .ref('/messages/' + uid)
      .once('value')
  ).val();

  const message: TMessage = {
    uid,
    description: val.description,
    type: val.type,
    userId: val.userId,
  };

  return message;
};

export {comfirmMessage, getMessageById};
