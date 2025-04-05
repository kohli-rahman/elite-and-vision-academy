
import { useState, useEffect, useRef } from 'react';

export const useTestTimer = (
  initialTimeLeft: number | null, 
  onTimeExpired: () => void
) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTimeLeft);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setTimeLeft(initialTimeLeft);
  }, [initialTimeLeft]);

  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current);
            onTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, onTimeExpired]);

  return { timeLeft };
};

export const formatTimeLeft = (timeLeft: number | null): string => {
  if (timeLeft === null) return "--:--:--";
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};
