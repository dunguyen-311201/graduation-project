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

  const contact = currentUser?.phoneNumber || currentUser?.email || '';
  const dirty =
    Boolean(formData?.displayName?.trim()) &&
    formData?.displayName !== (currentUser?.displayName ?? '');

  return (
    <ScreenBase loading={loading} title="Profile" flexDirection="row">
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* 1. Who you are */}
        <View style={styles.identity}>
          <Pressable
            onPress={handleChangeAvatar}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo">
            <Avatar
              size={72}
              uri={formData?.photoURL}
              name={currentUser?.displayName || currentUser?.email}
            />
          </Pressable>
          <View style={styles.flex}>
            <Txt variant="heading" numberOfLines={1}>
              {currentUser?.displayName || 'Your name'}
            </Txt>
            {contact ? (
              <Txt variant="caption" color={tokens.colors.textMuted} numberOfLines={1}>
                {contact}
              </Txt>
            ) : null}
            <View style={styles.badge}>
              <Txt variant="caption" color={tokens.colors.primary}>
                {ROLE_LABEL[currentUser?.role ?? 'user']}
              </Txt>
            </View>
          </View>
        </View>
        {_loading !== 0 && (
          <View style={styles.loading}>
            <View style={[{width: _loading + '%'}, styles.percent]} />
          </View>
        )}

        {/* 2. Personal info */}
        <Section title="Personal info">
          <View style={styles.form}>
            <CustomInput
              value={formData?.displayName ?? undefined}
              field={EUser.displayName}
              onChangeText={handleChangeText}
              title="Name"
            />
            <CustomInput
              value={formData?.phoneNumber ?? undefined}
              field={EUser.phoneNumber}
              onChangeText={handleChangeText}
              editable={false}
              title="Phone number"
              placeholder="Not set"
            />
            {formData?.citizenIdentification && (
              <CustomInput
                value={formData?.citizenIdentification}
                field={EUser.citizenIdentification}
                onChangeText={handleChangeText}
                editable={false}
                title="Citizen ID"
              />
            )}
            <AppButton label="Save changes" disabled={!dirty} onPress={handleNext} />
          </View>
        </Section>

        {/* 3. Safety (requesters only) */}
        {isUser && (
          <Section title="Safety">
            <View style={styles.menu}>
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
            </View>
          </Section>
        )}

        {/* 4. Preferences */}
        <Section title="Appearance">
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
        </Section>

        {/* 5. About, then the one destructive action last */}
        <Section title="About">
          <View style={styles.menu}>
            <ListRow
              title="Privacy & terms"
              onPress={() => navigate(EScreen.PRIVACY_LEGAL)}
            />
          </View>
        </Section>

        <View style={styles.menu}>
          <ListRow title="Sign out" danger onPress={signOut} right={<View />} />
        </View>
      </ScrollView>
    </ScreenBase>
  );
};

const ROLE_LABEL: Record<string, string> = {
  user: 'Driver',
  worker: 'Rescue worker',
  center: 'Rescue center',
  admin: 'Admin',
};

const Section = ({title, children}: {title: string; children: React.ReactNode}) => (
  <View style={styles.section}>
    <Txt variant="label" color={tokens.colors.textMuted}>
      {title}
    </Txt>
    {children}
  </View>
);

export default SettingsScreen;

const styles = themedStyles(() => StyleSheet.create({
  flex: {flex: 1},
  container: {
    rowGap: 24,
    paddingBottom: 24,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
    padding: 16,
    borderRadius: tokens.radius.card,
    backgroundColor: tokens.colors.surface,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.primarySoft,
  },
  section: {rowGap: 8},
  form: {rowGap: 12},
  menu: {
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
