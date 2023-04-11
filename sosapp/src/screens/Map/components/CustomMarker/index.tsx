import React from 'react';
import {Marker, MarkerDragStartEndEvent} from 'react-native-maps';
import {Location} from '@types';

type MarkerProps = {
  coordinate: Location;
  onChangeLocation: (location: Location) => void;
  title: string;
};

const CustomMarker = ({coordinate, title, onChangeLocation}: MarkerProps) => {
  const handleDragStart = (event: MarkerDragStartEndEvent) => {
    console.log(event.nativeEvent.coordinate);
    onChangeLocation(event.nativeEvent.coordinate);
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
