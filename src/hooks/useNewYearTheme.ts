import { useMemo } from 'react';

export const useNewYearTheme = () => {
  const isNewYearTheme = useMemo(() => {
    const now = new Date();
    
    // Theme activates: Dec 31, 2025 00:00:00
    const startDate = new Date(2025, 11, 31, 0, 0, 0);
    
    // Theme deactivates: Jan 2, 2026 23:59:59
    const endDate = new Date(2026, 0, 2, 23, 59, 59);
    
    return now >= startDate && now <= endDate;
  }, []);

  return isNewYearTheme;
};
