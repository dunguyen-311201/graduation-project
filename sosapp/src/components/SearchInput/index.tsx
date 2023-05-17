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
import {CloseIcon, DirectionIcon, TEXT_COLOR} from '@theme';

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
  origin?: Location;
  placeholder: string;
  icon?: ImageSourcePropType;
  onToDirection?: () => void;
  zIndex?: number;
};

const SearchInput = ({
  onSearch,
  customStyle,
  field,
  placeholder,
  icon,
  origin,
  isDirection = false,
  onToDirection,
  zIndex,
}: SearchProps) => {
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if (origin) {
      setLocation(origin);
    }
  }, [origin]);

  const handleSearch = useCallback(
    async (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
      const _location = detail?.geometry?.location;
      if (_location) {
        const {lat, lng} = _location;

        const currentLocation: Location = {
          latitude: lat,
          longitude: lng,
          description: {more: detail?.formatted_address},
        };

        await onSearch(currentLocation, field);
      }
    },
    [field, onSearch],
  );

  const handleClear = useCallback(() => {
    setLocation(undefined);
  }, []);

  return (
    <View style={[styles.container, customStyle, {...(zIndex && {zIndex})}]}>
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
          onFail={error => console.log(error)}
          textInputProps={{
            value:
              location?.description?.more ||
              location?.description?.district ||
              '',
            maxLength: 25,
            onChangeText: (value: string) => {
              setLocation({
                latitude: 0,
                longitude: 0,
                ...location,
                description: {more: value},
              });
            },
          }}
          query={query}
          currentLocation={true}
          enablePoweredByContainer={true}
          nearbyPlacesAPI="GooglePlacesSearch"
        />
        <View style={styles.rightButton}>
          {location?.description?.district !== '' && (
            <Pressable style={styles.buttonClear} onPress={handleClear}>
              <Image source={CloseIcon} style={styles.iconClear} />
            </Pressable>
          )}
          {!isDirection && (
            <Pressable style={styles.buttondirection} onPress={onToDirection}>
              <Image source={DirectionIcon} style={styles.directionIcon} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(SearchInput);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 3,
    top: 0,
    left: 0,
    right: 0,
    height: 75,
  },
  group: {
    position: 'absolute',
    zIndex: 4,
    top: 0,
    left: 0,
    right: 0,
  },
  buttonLogo: {
    position: 'absolute',
    top: 30,
    left: -30,
    zIndex: 6,
  },
  iconLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rightButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 80,
    position: 'absolute',
    height: 50,
    zIndex: 5,
    right: 20,
    top: 10,
  },
  buttonClear: {
    borderRadius: 8,
    marginRight: 10,
  },

  iconClear: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: TEXT_COLOR,
  },

  buttondirection: {
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
    left: 0,
    top: 15,
    right: 15,
    zIndex: 5,
  },
  textInput: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
