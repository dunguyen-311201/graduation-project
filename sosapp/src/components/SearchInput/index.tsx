import {DirectionIcon, TEXT_COLOR} from '@theme';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';

import Config from 'react-native-config';
import {Location} from '@types';

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
  region?: Location | null;
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
  region,
  isDirection = false,
  onToDirection,
  zIndex,
}: SearchProps) => {
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (region?.description) {
      setSearch(region.description);
    }
  }, [region]);

  const handleSearch = useCallback(
    async (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
      const {lat, lng} = detail?.geometry?.location || {};
      if (lat && lng) {
        const searchLocation: Location = {
          latitude: lat,
          city: data.terms?.at(-2).value,
          longitude: lng,
          description: data.description,
        };

        await onSearch(searchLocation, field);
        setSearch(data.description);
      }
    },
    [field, onSearch],
  );

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
            value: search,
            selectTextOnFocus: true,
            onChangeText: (value: string) => {
              setSearch(value);
            },
          }}
          query={query}
          currentLocation={true}
          enablePoweredByContainer={true}
          nearbyPlacesAPI="GooglePlacesSearch"
        />
        <View style={styles.rightButton}>
          {!isDirection && (
            <Pressable onPress={onToDirection}>
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
    flex: 10,
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
    right: -32,
    top: 14,
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
    right: 0,
    zIndex: 5,
  },
  textInput: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
