import {Location} from '@types';
import React, {memo} from 'react';
import {Marker, MarkerDragStartEndEvent} from 'react-native-maps';

type MarkerProps = {
  coordinate: Location;
  onChangeLocation: (lat: number, lng: number, field?: string) => void;
  title: string;
  field?: string;
};

const CustomMarker = ({
  coordinate,
  title,
  onChangeLocation,
  field,
}: MarkerProps) => {
  const handleDragStart = (event: MarkerDragStartEndEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    onChangeLocation(latitude, longitude, field);
  };

  return (
    <Marker
      coordinate={coordinate}
      title={title}
      draggable
      onDragStart={() => {}}
      onDragEnd={handleDragStart}
    />
  );
};

export default memo(CustomMarker);
