// src/hooks/useAffiliateData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAffiliateData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/affiliate/', { withCredentials: true });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, []);

  return { data, loading, error };
};

export default useAffiliateData;
