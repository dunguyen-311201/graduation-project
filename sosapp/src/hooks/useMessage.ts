import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import firebase from '@react-native-firebase/firestore';

import useAuth from './useAuth';

const useMessage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(true);

  const {currentUser} = useAuth();

  useEffect(() => {
    const getMessages = async () => {
      const _data = (
        await firebase()
          .collection('messages')
          .where('user', '==', currentUser?.uid)
          .get()
      ).docs;
      console.log(_data);
    };
    getMessages();
  }, [currentUser?.uid]);

  return {data, error, loading};
};

export default useMessage;
