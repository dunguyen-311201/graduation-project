import {CURRENT_LOCATION, USER_CACHE} from '@constants';
import {CustomInput, CustomSwitch, ScreenBase} from '@components';
import {EScreen, EUser} from '@enums';
import {Location, TRole} from '@types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import type {TextInputInstance} from 'react-native';
import {
  getAsyncStorage,
  requestLocationPermission,
  setAsyncStorage,
} from '@utils';

import {Context} from '@context';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';
import {themedStyles} from '../../theme/tokens';

type FormData = {
  [EUser.displayName]?: string;
  [EUser.role]?: TRole;
  [EUser.citizenIdentification]?: string;
  [EUser.location]?: Location;
  [EUser.first]?: string;
  [EUser.last]?: string;
};
const SetupInfoScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const inputFirstRef = useRef<TextInputInstance>(null);
  const inputLastRef = useRef<TextInputInstance>(null);
  const inputcitizenRef = useRef<TextInputInstance>(null);

  const [data, setData] = useState<FormData>();
  const [isCenter, setIsCenter] = useState(false);

  const {currentUser} = useContext(Context);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOptions({headerShown: true});

    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions, currentUser]);

  useEffect(() => {
    const setup = async () => {
      await requestLocationPermission();
      const cache = await getAsyncStorage<Location>(CURRENT_LOCATION);
      cache && setData(prev => ({...prev, location: cache}));
    };

    isCenter && setup();
  }, [isCenter]);

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);
      let {firstName, lastName, ...db} = data || {};

      let newCache = {
        ...db,
        displayName: `${firstName} ${lastName}`,
        role: 'user',
      };

      if (isCenter) {
        newCache = {...newCache, role: 'center'};
      }

      const cache = await getAsyncStorage<Location>(CURRENT_LOCATION);
      if (cache) {
        newCache = {...newCache, location: cache};
      }

      await setAsyncStorage(USER_CACHE, newCache);

      navigate(EScreen.CONFIRM_POLICY);
    } catch (_error) {}
    setLoading(false);
  }, [data, isCenter]);

  const handleChangeSwitch = useCallback(() => {
    setIsCenter(prev => !prev);
  }, []);

  const handleChangeInput = useCallback((value: string, field: string) => {
    setData(prev => ({...prev, [field]: value}));
  }, []);

  const handleEndEditing = useCallback((field: string) => {
    if (field === EUser.first) {
      inputLastRef?.current?.focus();
      return;
    }
  }, []);

  return (
    <ScreenBase
      title="Set up your profile"
      onNext={handleNext}
      loading={loading}
      disableNext={
        !data?.firstName?.trim() ||
        !data?.lastName?.trim() ||
        (isCenter && !data?.citizenIdentification?.trim())
      }>
      <View style={styles.content}>
        <CustomInput
          field={EUser.first}
          value={data?.firstName || ''}
          onChangeText={handleChangeInput}
          title="First Name"
          ref={inputFirstRef}
          border
          onEndEditing={handleEndEditing}
        />
        <CustomInput
          field={EUser.last}
          value={data?.lastName || ''}
          onChangeText={handleChangeInput}
          ref={inputLastRef}
          title="Last Name"
          onEndEditing={handleEndEditing}
          border
        />

        <CustomSwitch
          title="I am a rescue center"
          value={isCenter}
          onChange={handleChangeSwitch}
        />

        {isCenter && (
          <CustomInput
            field={EUser.citizenIdentification}
            value={data?.citizenIdentification || ''}
            onChangeText={handleChangeInput}
            title="Citizen ID"
            inputMode="numeric"
            ref={inputcitizenRef}
            onEndEditing={handleEndEditing}
            border
          />
        )}
      </View>
    </ScreenBase>
  );
};

export default SetupInfoScreen;

const styles = themedStyles(() => StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    marginTop: 20,
    rowGap: 16,
  },
}));
