import React from 'react';
import {Marker, MarkerDragStartEndEvent} from 'react-native-maps';
import {Location} from '@types';

type MarkerProps = {
  coordinate: Location;
  onChangeLocation: (lat: number, lng: number) => void;
  title: string;
};

const CustomMarker = ({coordinate, title, onChangeLocation}: MarkerProps) => {
  const handleDragStart = (event: MarkerDragStartEndEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    onChangeLocation(latitude, longitude);
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

export default CustomMarker;
