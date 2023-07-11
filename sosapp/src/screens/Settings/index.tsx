import {CustomInput, ScreenBase} from '@components';
import {EScreen, EUser} from '@enums';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {ProfileIcon, WHITE_COLOR} from '@theme';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {Context} from '@context';
import {RootScreenNavigationProps} from '@navigation';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';

type FormData = {
  [EUser.displayName]?: string;
  [EUser.phoneNumber]?: string;
  [EUser.citizenIdentification]?: string;
  [EUser.photoURL]?: string | null;
};

const avatarRef = storage().ref('/avatars');

const SettingsScreen = () => {
  const {goBack} = useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  const {currentUser, updateProfile, loading} = useContext(Context);

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
    const result = await launchImageLibrary({mediaType: 'photo', quality: 1});

    if (result.didCancel) {
      console.log("can't launch image library");
    } else if (result.errorCode) {
      console.log('failed to launch image library');
    } else {
      const uri = result.assets?.at(0)?.uri;

      if (uri) {
        const task = avatarRef.child(Date.now() + '.png').putFile(uri);

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
            task.snapshot?.ref.getDownloadURL().then(async downloadURL => {
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
      onBack={goBack}
      loading={loading}
      title="Setting"
      flexDirection="row"
      onNext={handleNext}
      nextTitle="Update">
      <View style={styles.container}>
        <Pressable onPress={handleChangeAvatar} style={styles.boxAvatar}>
          <Image
            style={styles.avatar}
            resizeMode="cover"
            source={
              formData?.photoURL
                ? {
                    uri: formData?.photoURL,
                  }
                : ProfileIcon
            }
          />
          {_loading !== 0 && (
            <View style={styles.loading}>
              <View style={[{width: _loading + '%'}, styles.percent]} />
            </View>
          )}
        </Pressable>
        <CustomInput
          value={formData?.displayName}
          field={EUser.displayName}
          onChangeText={handleChangeText}
          border
          title="Name"
        />

        <CustomInput
          value={formData?.phoneNumber}
          field={EUser.phoneNumber}
          onChangeText={handleChangeText}
          editable={false}
          border
          title="Phone Number"
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
      </View>
    </ScreenBase>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 16,
  },

  boxAvatar: {
    alignSelf: 'center',
    rowGap: 20,
    height: 180,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: WHITE_COLOR,
  },
  loading: {
    width: 160,
    alignSelf: 'center',
    borderRadius: 8,
    height: 10,
    backgroundColor: 'transparent',
  },
  percent: {
    borderRadius: 8,
    height: 10,
    backgroundColor: 'green',
  },
});
