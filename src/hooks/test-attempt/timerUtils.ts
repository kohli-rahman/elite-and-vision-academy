
import { useState, useEffect, useRef } from 'react';

export const useTestTimer = (
  initialTimeLeft: number | null, 
  onTimeExpired: () => void
) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTimeLeft);
  const timerRef = useRef<any>(null);
  const onTimeExpiredRef = useRef(onTimeExpired);
  const hasTriggeredExpiration = useRef<boolean>(false);

  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  useEffect(() => {
    setTimeLeft(initialTimeLeft);
    
    // Reset the expiration flag when the timer is reinitialized with a new value
    if (initialTimeLeft !== null && initialTimeLeft > 0) {
      hasTriggeredExpiration.current = false;
    }
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
            console.log("Timer expired, triggering submission");
            if (!hasTriggeredExpiration.current) {
              hasTriggeredExpiration.current = true;
              onTimeExpiredRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !timerRef.current && !hasTriggeredExpiration.current) {
      // Handle case where timeLeft is already 0 when component mounts
      console.log("Time already expired, triggering submission");
      hasTriggeredExpiration.current = true;
      onTimeExpiredRef.current();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

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
