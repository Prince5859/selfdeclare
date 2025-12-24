import { useMemo } from 'react';

export const useChristmasTheme = () => {
  const isChristmasPeriod = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    
    // Christmas period: Dec 24 00:00 to Dec 26 23:59
    const startDate = new Date(year, 11, 24, 0, 0, 0); // Dec 24, 00:00
    const endDate = new Date(year, 11, 26, 23, 59, 59); // Dec 26, 23:59
    
    return now >= startDate && now <= endDate;
  }, []);

  return { isChristmasPeriod };
};
