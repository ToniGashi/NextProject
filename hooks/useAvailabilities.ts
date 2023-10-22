import { useState } from 'react';
import axios from 'axios';

const useAvailabilities = () => {
  const [availabilites, setAvailabilities] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const fetchAvailabilities = async ({
    slug,
    date,
    time,
    partySize
  }: {
    slug: string;
    date: string;
    time: string | undefined;
    partySize: number;
  }) => {
    try {
      const [day, _] = date.split('T');
      setLoading(true);
      const resp = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability?time=${time}&day=${day}&partySize=${partySize}`
      );
      setAvailabilities(resp?.data?.availabilities);
      setLoading(false);
    } catch (err) {
      setError(error?.response?.data?.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    availabilites,
    loading,
    error,
    fetchAvailabilities
  };
};

export default useAvailabilities;
