'use client';

import React, { useEffect } from 'react';
import { InstallAppPrompt } from './InstallAppPrompt';

export const ServiceWorkerRegister: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service Worker registration error:', err);
        });
      });
    }
  }, []);

  return <InstallAppPrompt />;
};
