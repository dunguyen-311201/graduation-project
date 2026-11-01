import {
  AppButton,
  BackButton,
  CustomText,
  Notification,
  SearchInput,
  Txt,
} from '@components';
import {CloseIcon, FromLocationIcon, ToLocationIcon, tokens} from '@theme';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {ERole, EScreen} from '@enums';
import MapView, {Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  fetchDistanceAndTime,
  formatTime,
  getAsyncStorage,
  requestLocationPermission,
} from '@utils';

import {CURRENT_LOCATION, MAPS_ENABLED, externalMapUrl} from '@constants';
import {ENV} from '@constants';
import {Context} from '@context';
import {CustomMarker} from './components';
import {Location} from '@types';
import MapViewDirections from 'react-native-maps-directions';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

const GOOGLE_MAPS_API_KEY = ENV.GOOGLE_MAPS_API_KEY;

type SearchLocation = {
  from?: Location | null;
  to?: Location | null;
  distance?: number;
  timeout?: number;
};

type ConfirmRoute = RouteProp<RootParamList, EScreen.MAP>;

const MapScreen = () => {
  const {goBack} = useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const mapRef = useRef<MapView | null>(null);
  const {currentUser} = useContext(Context);

  let {to} = useRoute<ConfirmRoute>().params || {};

  const [isDirection, setIsDirection] = useState(false);

  const [locations, setLocations] = useState<SearchLocation>();

  useEffect(() => {
    currentUser?.role === ERole.WORKER
      ? requestLocationPermission(1)
      : requestLocationPermission();
  }, [currentUser]);

  useEffect(() => {
    const setup = async () => {
      const cacheLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);

      if (cacheLocation) {
        if (to) {
          const data = await fetchDistanceAndTime({to, from: cacheLocation});
          if (data) {
            setLocations(data);
          }

          return;
        }

        setLocations({from: cacheLocation});
      }
    };

    setup();
  }, [to]);

  const handleSearch = useCallback(
    async (_location: Location, _field?: string) => {
      if (_field === 'to' && locations?.from) {
        setLocations(prev => ({...prev, to: _location}));
      }
      if (_field === 'from' && locations?.to) {
        setLocations(prev => ({...prev, from: _location}));
      }
    },
    [locations],
  );

  const handleToDirectionandSearch = useCallback(() => {
    setIsDirection(prev => !prev);
  }, []);

  const handleChangeLocation = useCallback(() => {}, []);

  const map = useMemo(() => {
    if (!MAPS_ENABLED) {
      const target = locations?.to ?? locations?.from ?? to;
      return (
        <View style={styles.fallback}>
          <Txt variant="heading" center>
            Map is not set up
          </Txt>
          <Txt variant="body" color={tokens.colors.textMuted} center>
            This build has no Google Maps key. You can still open the location
            in Google Maps.
          </Txt>
          {target ? (
            <AppButton
              label="Open in Google Maps"
              onPress={() =>
                Linking.openURL(externalMapUrl(target.latitude, target.longitude))
              }
            />
          ) : null}
        </View>
      );
    }
    if (locations?.from) {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          ref={mapRef}
          region={{
            ...locations.from,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {locations?.to && GOOGLE_MAPS_API_KEY && (
            <MapViewDirections
              origin={locations?.from}
              destination={locations?.to}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={8}
              strokeColor="#3A4C11"
            />
          )}
          <View>
            <CustomMarker
              coordinate={locations.from}
              title={locations?.to ? 'Begin' : 'Location'}
              field="from"
              onChangeLocation={handleChangeLocation}
            />
            <Circle
              center={locations.from}
              radius={500}
              fillColor="#42ff22"
              strokeWidth={2}
            />
          </View>
          {locations?.to && (
            <View>
              <CustomMarker
                coordinate={locations.to}
                title="End"
                field="from"
                onChangeLocation={handleChangeLocation}
              />
              <Circle
                center={locations.to}
                radius={500}
                fillColor="#42ff22"
                strokeWidth={2}
              />
            </View>
          )}
        </MapView>
      );
    }
    return <></>;
  }, [handleChangeLocation, locations?.from, locations?.to, to]);

  return (
    <>
      <Notification />
      <View style={styles.container}>
        {!isDirection ? (
          <View style={styles.navbar}>
            <View style={styles.iconBack}>
              <BackButton onPress={goBack} />
            </View>
            <View style={styles.single}>
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search"
                field="from"
                region={locations?.from}
                onToDirection={handleToDirectionandSearch}
                isDirection={isDirection}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.navbar, styles.direction]}>
            <View style={styles.group}>
              <SearchInput
                icon={FromLocationIcon}
                onSearch={handleSearch}
                placeholder="From"
                field="from"
                region={locations?.from}
                onToDirection={handleToDirectionandSearch}
                isDirection={isDirection}
                zIndex={3}
              />
              <SearchInput
                icon={ToLocationIcon}
                onSearch={handleSearch}
                placeholder="Where to"
                field="to"
                onToDirection={handleToDirectionandSearch}
                isDirection={isDirection}
                customStyle={styles.lastItem}
                zIndex={2}
              />
            </View>
            <View style={styles.navRight}>
              <Pressable onPress={handleToDirectionandSearch}>
                <Image source={CloseIcon} style={styles.icon} />
              </Pressable>
            </View>
          </View>
        )}

        {map}

        {locations?.timeout ? (
          <View style={styles.distanceInfo}>
            <CustomText
              text={'Time: ' + formatTime(locations.timeout)}
              type="text_medium_16"
              color="blue"
            />
            <CustomText
              text={`Distance: ${(locations.distance ?? 0) + 0.001} km`}
              type="text_medium_16"
              color="blue"
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    </>
  );
};

export default MapScreen;

const styles = themedStyles(() => StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
    paddingHorizontal: 24,
    backgroundColor: tokens.colors.bg,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  navbar: {
    zIndex: 2,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: themeColors.surfaceRaised,
    width: '100%',
    height: 80,
  },
  navRight: {
    paddingTop: 20,
  },
  single: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    right: 40,
    left: 40,
    backgroundColor: themeColors.surfaceRaised,
    zIndex: 3,
  },
  direction: {minHeight: 150, paddingLeft: 40},
  iconBack: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 4,
  },
  group: {
    flex: 1,
  },
  lastItem: {
    top: '50%',
  },

  icon: {
    tintColor: themeColors.text,
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 20,
  },
  distanceInfo: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: themeColors.surfaceRaised,
    borderRadius: 10,
    flexDirection: 'row',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
}));
