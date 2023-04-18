import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Image,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import React, {useCallback, memo, useEffect, useState} from 'react';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';

import {Location} from '@types';
import {BackIcon, ClearInputIcon, DirectionIcon, TEXT_COLOR} from '@theme';
import {useDeviceLocation} from '@hooks';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const query = {
  key: GOOGLE_MAPS_API_KEY,
  language: 'vn',
};

type SearchProps = {
  onSearch: (location: Location, field?: string) => void;
  customStyle?: StyleProp<ViewStyle>;
  isDirection?: boolean;
  field?: string;
  placeholder: string;
  icon?: ImageSourcePropType;
  onToDirection?: () => void;
};

const SearchInput = ({
  onSearch,
  customStyle,
  field,
  placeholder,
  icon,
  isDirection = false,
  onToDirection,
}: SearchProps) => {
  const {deviceLocation} = useDeviceLocation();

  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if (deviceLocation) {
      setLocation(prev => ({...prev, ...deviceLocation}));
    }
  }, [deviceLocation]);

  const handleSearch = useCallback(
    (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
      const _location = detail?.geometry?.location;
      if (_location) {
        const {lat, lng} = _location;

        const currentLocation = {
          latitude: lat,
          longitude: lng,
          description: detail?.formatted_address,
        };

        onSearch(currentLocation, field);
        setLocation(undefined);
      }
    },
    [field, onSearch],
  );

  const handleClear = useCallback(() => {
    setLocation({latitude: 0, longitude: 0, description: ''});
  }, []);

  console.log(isDirection);

  return (
    <View style={[styles.container, customStyle]}>
      <View style={styles.group}>
        {isDirection && icon !== undefined && (
          <Pressable style={styles.buttonLogo}>
            <Image source={icon} style={styles.iconLogo} />
          </Pressable>
        )}

        <GooglePlacesAutocomplete
          placeholder={placeholder}
          styles={inputSearch}
          fetchDetails={true}
          onPress={handleSearch}
          keepResultsAfterBlur={false}
          textInputProps={{
            value: location?.description || '',
            onChangeText: (value: string) => {
              setLocation({
                latitude: 0,
                longitude: 0,
                ...location,
                description: value,
              });
            },
          }}
          query={query}
          currentLocation={true}
          enablePoweredByContainer={true}
          nearbyPlacesAPI="GooglePlacesSearch"
        />
        {location?.description !== '' && (
          <Pressable style={styles.buttonClear} onPress={handleClear}>
            <Image source={ClearInputIcon} style={styles.iconClear} />
          </Pressable>
        )}
        {!isDirection && (
          <Pressable style={styles.buttondirection} onPress={onToDirection}>
            <Image source={DirectionIcon} style={styles.directionIcon} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default memo(SearchInput);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  group: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
  },
  buttonLogo: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 4,
  },
  iconLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  buttonClear: {
    position: 'absolute',
    top: 30,
    right: 80,
    zIndex: 4,
    borderRadius: 10,
  },

  iconClear: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  buttondirection: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 4,
    borderLeftWidth: 1,
    paddingHorizontal: 7,
  },
  directionIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

const inputSearch = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 50,
    top: 15,
    right: 20,
    zIndex: 3,
  },
  textInput: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
