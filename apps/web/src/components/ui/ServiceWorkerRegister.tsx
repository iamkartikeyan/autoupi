'use client';

import React, { useEffect } from 'react';
import { InstallAppPrompt } from './InstallAppPrompt';

export const ServiceWorkerRegister: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      // Force unregister stale workers and install fresh network-first worker
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.update();
        }
      });

      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          reg.update();
        }).catch((err) => {
          console.warn('SW registration:', err);
        });
      }
    }
  }, []);

  return <InstallAppPrompt />;
};
