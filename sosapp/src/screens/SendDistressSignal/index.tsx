import {CURRENT_LOCATION, MESSAGE_PENDING, types} from '@constants';
import {
  CustomText,
  DropDown,
  Error,
  ScreenBase,
  SearchInput,
  Textreae,
} from '@components';
import {ERole, EScreen} from '@enums';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, TextInput, View} from 'react-native';
import {getAsyncStorage, requestLocationPermission} from '@utils';

import {Context} from '@context';
import {Location} from '@types';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';

type FormData = {
  description?: string;
  type?: string;
  location: Location | null;
};

type ConfirmRoute = RouteProp<RootParamList, EScreen.SEND_DISTRESS_SIGNAL>;

const SendDistreeSignal = () => {
  const {reset} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const {onNew} = useRoute<ConfirmRoute>().params || {};

  const {currentUser} = useContext(Context);
  const [error, setError] = useState(null);

  const textreaeRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormData>({
    description: '',
    type: types[0],
    location: null,
  });

  useEffect(() => {
    currentUser?.role === ERole.WORKER
      ? requestLocationPermission(1)
      : requestLocationPermission();

    const setup = async () => {
      const cache = await getAsyncStorage<Location>(CURRENT_LOCATION);
      if (cache) {
        setMessage(prev => ({...prev, location: cache}));
      }
    };

    setup();
  }, [currentUser]);

  const sendSignal = useCallback(async () => {
    if (currentUser) {
      setLoading(true);

      try {
        const mess = {
          ...message,
          status: MESSAGE_PENDING,
          time: Date.now(),
          userID: currentUser.id,
        };

        reset({routes: [{name: EScreen.MESSAGES}], index: 0});
        onNew && (await onNew(mess));
      } catch (_error: any) {
        setError(_error);
      }

      setLoading(false);
    }
  }, [message, currentUser]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setMessage(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleSearch = useCallback(async (_location: Location) => {
    setMessage(prev => ({...prev, location: _location}));
  }, []);

  return (
    <ScreenBase
      loading={loading}
      onNext={sendSignal}
      title="You have to connect to the support service">
      <View style={styles.mapField}>
        <CustomText text="Location" type="text_medium_16" />
        <SearchInput
          region={message?.location}
          onSearch={handleSearch}
          placeholder="Location"
          field="location"
          isDirection={true}
          zIndex={4}
          customStyle={styles.search}
        />
      </View>
      <DropDown
        data={types}
        initValue={message?.type}
        onSelect={handleChangeText}
        field="type"
        title="Type"
      />
      <Textreae
        ref={textreaeRef}
        title="Description"
        value={message?.description}
        field="description"
        onChangeText={handleChangeText}
      />
      {error && <Error message="Please check request!" />}
    </ScreenBase>
  );
};

export default memo(SendDistreeSignal);

const styles = StyleSheet.create({
  mapField: {
    position: 'relative',
    width: '100%',
    height: 80,
    marginTop: 20,
    zIndex: 3,
  },
  search: {
    top: 20,
    right: -10,
  },
});
