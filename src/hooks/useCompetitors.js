import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useCompetitors = () => {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompetitors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/competitors');
      setCompetitors(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch competitors');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCompetitor = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/competitors', data);
      toast.success('Competitor added successfully');
      return response.data.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompetitor = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const response = await api.put(`/competitors/${id}`, data);
      toast.success('Competitor updated successfully');
      return response.data.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompetitor = useCallback(async (id) => {
    try {
      setLoading(true);
      await api.delete(`/competitors/${id}`);
      toast.success('Competitor deleted successfully');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerScrape = useCallback(async (id) => {
    try {
      setLoading(true);
      await api.post(`/competitors/${id}/scrape`);
      toast.success('Scraping triggered! Check updates in 1-2 minutes');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    competitors,
    loading,
    error,
    fetchCompetitors,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    triggerScrape,
  };
};