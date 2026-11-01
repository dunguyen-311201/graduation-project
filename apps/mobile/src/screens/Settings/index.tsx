import {
  AppButton,
  Avatar,
  ChipGroup,
  CustomInput,
  ListRow,
  ScreenBase,
  Txt,
} from '@components';
import {ERole, EScreen, EUser} from '@enums';
import {useEmergencyContacts, useSavedPlaces} from '@features/profile';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {ThemePreference, tokens, useTheme} from '@theme';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import * as ImagePicker from 'expo-image-picker';

import {Context} from '@context';
import {
  getDownloadURL,
  getStorage,
  putFile,
  ref,
} from '@react-native-firebase/storage';
import {themedStyles} from '../../theme/tokens';

type FormData = {
  [EUser.displayName]?: string | null;
  [EUser.phoneNumber]?: string | null;
  [EUser.citizenIdentification]?: string | null;
  [EUser.photoURL]?: string | null;
};

const SettingsScreen = () => {
  const {currentUser, updateProfile, loading, signOut} = useContext(Context);

  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();
  const {contacts} = useEmergencyContacts();
  const {places} = useSavedPlaces();
  const isUser = currentUser?.role === ERole.USER;
  const {preference, setPreference} = useTheme();
  const placeCount = Object.keys(places).length;

  const [formData, setFormData] = useState<FormData>();
  const [_loading, setLoading] = useState(0);

  useEffect(() => {
    currentUser && setFormData(currentUser);
  }, [currentUser]);

  useLayoutEffect(() => {
    _loading === 100 && setLoading(0);
  }, [_loading]);

  const handleChangeText = useCallback((value: string, field: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  }, []);

  const handleNext = useCallback(async () => {
    const {displayName} = formData || {};

    if (displayName) {
      const update: any = {displayName};
      await updateProfile(update);
    }
  }, [formData]);

  const handleChangeAvatar = useCallback(async () => {
    // Avatar upload needs Firebase Storage, which requires the Blaze plan.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets.at(0)?.uri;

      if (uri) {
        const avatarRef = ref(getStorage(), `avatars/${Date.now()}.png`);
        const task = putFile(avatarRef, uri);

        task.on(
          'state_changed',
          snap => {
            setLoading(
              Math.floor((snap.bytesTransferred / snap.totalBytes) * 100),
            );
          },
          error => {
            console.log(error);
          },
          () => {
            getDownloadURL(avatarRef).then(async downloadURL => {
              const update: any = {photoURL: downloadURL};
              await updateProfile(update);
            });
          },
        );
      }
    }
  }, []);

  return (
    <ScreenBase
      loading={loading}
      title="Profile"
      flexDirection="row">
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Pressable
          onPress={handleChangeAvatar}
          style={styles.boxAvatar}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo">
          <Avatar
            size={96}
            uri={formData?.photoURL}
            name={formData?.displayName || currentUser?.email}
          />
          <Txt variant="caption" color={tokens.colors.primary}>
            Change photo
          </Txt>
          {_loading !== 0 && (
            <View style={styles.loading}>
              <View style={[{width: _loading + '%'}, styles.percent]} />
            </View>
          )}
        </Pressable>
        <CustomInput
          value={formData?.displayName ?? undefined}
          field={EUser.displayName}
          onChangeText={handleChangeText}
          border
          title="Name"
        />

        <CustomInput
          value={formData?.phoneNumber ?? undefined}
          field={EUser.phoneNumber}
          onChangeText={handleChangeText}
          editable={false}
          border
          title="Phone Number"
          placeholder="Not set"
        />

        {formData?.citizenIdentification && (
          <CustomInput
            value={formData?.citizenIdentification}
            field={EUser.citizenIdentification}
            onChangeText={handleChangeText}
            editable={false}
            border
            title="Citizen Identification"
          />
        )}

        {formData?.displayName !== undefined &&
          (formData?.displayName ?? '') !== (currentUser?.displayName ?? '') && (
            <AppButton label="Save changes" onPress={handleNext} />
          )}

        <View style={styles.appearance}>
          <Txt variant="label" color={tokens.colors.textMuted}>
            Appearance
          </Txt>
          <ChipGroup
            options={[
              {value: 'dark', label: 'Dark'},
              {value: 'light', label: 'Light'},
              {value: 'system', label: 'System'},
            ]}
            value={preference}
            onChange={v => setPreference(v as ThemePreference)}
            accessibilityLabel="Appearance"
          />
        </View>

        <View style={styles.menu}>
          {isUser && (
            <>
              <ListRow
                title="Emergency contacts"
                subtitle={
                  contacts.length
                    ? `${contacts.length} saved`
                    : 'Tell family when you send an SOS'
                }
                onPress={() => navigate(EScreen.EMERGENCY_CONTACTS)}
              />
              <View style={styles.divider} />
              <ListRow
                title="Saved places"
                subtitle={placeCount ? `${placeCount} saved` : 'Add Home and Work'}
                onPress={() => navigate(EScreen.SAVED_PLACES)}
              />
              <View style={styles.divider} />
            </>
          )}
          <ListRow
            title="Privacy & terms"
            onPress={() => navigate(EScreen.PRIVACY_LEGAL)}
          />
        </View>

        <View style={styles.menu}>
          <ListRow title="Sign out" danger onPress={signOut} right={<View />} />
        </View>
      </ScrollView>
    </ScreenBase>
  );
};

export default SettingsScreen;

const styles = themedStyles(() => StyleSheet.create({
  flex: {flex: 1},
  container: {
    rowGap: 16,
    paddingBottom: 16,
  },
  appearance: {marginTop: 8, rowGap: 8},
  menu: {
    marginTop: 8,
    borderRadius: tokens.radius.card,
    backgroundColor: tokens.colors.surface,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: tokens.colors.border,
  },
  footer: {
    rowGap: 8,
    paddingTop: 12,
  },

  boxAvatar: {
    alignSelf: 'center',
    alignItems: 'center',
    rowGap: 8,
  },
  loading: {
    width: 96,
    alignSelf: 'center',
    borderRadius: 8,
    height: 10,
    backgroundColor: 'transparent',
  },
  percent: {
    borderRadius: 8,
    height: 10,
    backgroundColor: tokens.colors.success,
  },
}));
