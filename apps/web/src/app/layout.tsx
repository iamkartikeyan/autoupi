import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { PaymentProvider } from '../context/PaymentContext';
import { AppShell } from '../components/ui/AppShell';

import { ServiceWorkerRegister } from '../components/ui/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Auto-UPI — Instant Payments',
  description: 'Fast, secure cross-border UPI payments and instant domestic bank settlements.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Auto-UPI',
  },
};

export default function RootLayout({
  children,
}: {
  children?: any;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0E0F12" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Auto-UPI" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-gray-100 min-h-screen">
        <ToastProvider>
          <AuthProvider>
            <PaymentProvider>
              <AppShell>{children}</AppShell>
              <ServiceWorkerRegister />
            </PaymentProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
