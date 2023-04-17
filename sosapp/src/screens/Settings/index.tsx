import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {CustomInput} from '@components/common';
import {useAuth} from '@hooks';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {TUser} from '@types/User';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

// const GOOGLE_MAPS_APIKEY = 'AIzaSyBN9oFyb8tZu1zHzUcE1cMR4--NCOucmOM';

const SettingsScreen = () => {
  const {currentUser} = useAuth();

  const [profile, setProfile] = useState<TUser>();

  useEffect(() => {
    if (currentUser && currentUser !== null) {
      let userInfo: TUser = {};
      const {displayName, email, phoneNumber, photoURL, uid} = currentUser;
      if (displayName !== null) {
        userInfo = {displayName};
      }
      if (email !== null) {
        userInfo = {...userInfo, email};
      }
      if (phoneNumber !== null) {
        userInfo = {...userInfo, phoneNumber};
      }
      if (photoURL !== null) {
        userInfo = {...userInfo, photoURL};
      }
      if (uid !== null) {
        userInfo = {...userInfo, uid};
      }
      setProfile(userInfo);
    }
  }, [currentUser]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setProfile({[field]: value});
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* <GooglePlacesAutocomplete
        placeholder="Search"
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            fontSize: 18,
          },
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: 'en',
        }}
        enablePoweredByContainer={true}
        nearbyPlacesAPI="GooglePlacesSearch"
      /> */}
      <CustomInput
        title="Display Name"
        onChangeText={handleChangeText}
        field="displayName"
        value={profile?.displayName}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
