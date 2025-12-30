'use client';

import { useState, useEffect, useCallback } from 'react';
import { StaticContent, ContentStats, ContentData } from '../types';

export function useAdminData() {
  const [staticContents, setStaticContents] = useState<StaticContent[]>([]);
  const [allContents, setAllContents] = useState<ContentData[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats>({ total: 0, byCategory: {} });
  const [isLoading, setIsLoading] = useState(true);

  const fetchContents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/static-content');
      if (!response.ok) {
        throw new Error('Failed to fetch contents');
      }
      const data = await response.json();
      setStaticContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchContentStats = useCallback(async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data: ContentData[] = await response.json();
        setAllContents(data);
        setContentStats({
          total: data.length || 0,
          byCategory: {}
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchContents();
    fetchContentStats();
  }, [fetchContents, fetchContentStats]);

  return {
    staticContents,
    allContents,
    contentStats,
    isLoading,
    fetchContents,
    fetchContentStats
  };
}
