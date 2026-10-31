const DIVISIONS: {amount: number; name: string}[] = [
  {amount: 60, name: 's'},
  {amount: 60, name: 'm'},
  {amount: 24, name: 'h'},
  {amount: 7, name: 'd'},
  {amount: 4.34524, name: 'w'},
  {amount: 12, name: 'mo'},
  {amount: Number.POSITIVE_INFINITY, name: 'y'},
];

export function formatTimeAgo(time: number) {
  let duration = Math.abs((Date.now() - time) / 1000);

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (duration < division.amount) {
      return Math.round(duration).toFixed(0) + ' ' + division.name;
    }
    duration /= division.amount;
  }
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours} hours `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} minutes`;
  }

  return formattedTime.trim();
}

export function formatDistance(kilometers: number) {
  if (kilometers === 0) {
    return '0 km';
  }

  const distanceInMeters = kilometers * 1000;
  const remainingMeters = distanceInMeters % 1000;
  const kilometersString = Math.floor(kilometers).toString();
  const metersString = remainingMeters.toFixed(0);

  let formattedDistance = '';
  if (kilometersString !== '0') {
    formattedDistance += kilometersString + ' km';
  }
  if (metersString !== '0') {
    formattedDistance += ' ' + metersString + ' m';
  }

  return formattedDistance.trim();
}
