import {useCallback, useContext, useEffect, useState} from 'react';

import {Alert} from 'react-native';
import {Context} from '@context';
import {TUser} from '@types';
import firebase from '@react-native-firebase/firestore';

const useWorker = (free?: boolean) => {
  const [workers, setData] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {currentUser} = useContext(Context);

  const subscribeChanges = useCallback(() => {
    if (currentUser) {
      try {
        const {id} = currentUser;

        const collection = firebase().collection('users');

        let query = collection.where('centerID', '==', id);
        if (free) {
          query = query.where('status', '==', 'free');
        }

        return query.onSnapshot(snap => {
          if (snap?.docs.length > 0) {
            const newData: any[] = [];
            snap?.docs.forEach(doc => {
              newData.push({id: doc.id, ...doc.data()});
            });
            setData(newData);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [currentUser, free]);

  useEffect(() => {
    const unsubscribe = subscribeChanges();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [subscribeChanges]);

  // useEffect(() => {
  //   if (currentUser) {
  //     let query = firebase()
  //       .collection('users')
  //       .where('centerID', '==', currentUser.id);
  //     if (free) {
  //       query = query
  //         .where('lastLogin', '!=', null)
  //         .where('status', '==', 'free');
  //     }

  //     query.onSnapshot(snap => {
  //       const updatedData: any[] = [];
  //       let data: any;
  //       let id: string;

  //       const docChanges = snap?.docChanges();

  //       if (docChanges?.length > 0) {
  //         setLoading(true);

  //         docChanges.forEach(docChange => {
  //           data = docChange.doc.data();
  //           id = docChange.doc.id;

  //           if (docChange.type === 'added') {
  //             updatedData.push({id, ...data});
  //           } else if (docChange.type === 'removed') {
  //             setData(prev => prev.filter(item => item.id !== id));
  //           } else {
  //             setData(prev => {
  //               const t = prev.filter(item => item.id !== id);
  //               return [{id, ...data}, ...t];
  //             });
  //           }

  //           setData(prev => {
  //             if (updatedData.length > 1) {
  //               return updatedData;
  //             }

  //             return [...updatedData, ...prev];
  //           });

  //           setLoading(false);
  //         });
  //       }
  //     });
  //   }
  // }, [currentUser]);

  const deleteWorker = useCallback(async (id: string) => {
    Alert.alert(
      'Delete Worker',
      'Are you sure you want to delete this Worker?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setLoading(true);
            try {
              await firebase()
                .doc('users/' + id)
                .delete();
            } catch (err: any) {
              setError(err);
            }
            setLoading(false);
          },
        },
      ],
    );
  }, []);

  const activeWorker = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await firebase()
        .doc('users/' + id)
        .update({disabled: false});
    } catch (err: any) {
      setError(err);
    }
    setLoading(false);
  }, []);

  return {
    workers,
    loading,
    error,
    deleteWorker,
    activeWorker,
  };
};

export default useWorker;
