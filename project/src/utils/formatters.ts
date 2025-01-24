// Format location object to string representation
export const formatLocation = (location: { lat: number; lng: number } | string | null | undefined): string => {
  if (!location) return 'Location not specified';
  
  if (typeof location === 'string') return location;
  
  if ('lat' in location && 'lng' in location) {
    return `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`;
  }
  
  return 'Invalid location format';
};