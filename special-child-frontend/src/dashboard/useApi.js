import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFn, deps = []) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiFn();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
