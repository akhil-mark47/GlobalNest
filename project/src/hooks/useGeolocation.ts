import { useState, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
}

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    try {
      setLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } catch (err) {
      setError('Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getCurrentLocation, loading, error };
};