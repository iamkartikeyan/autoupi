import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { PaymentProvider } from '../context/PaymentContext';
import { AppShell } from '../components/ui/AppShell';

export const metadata: Metadata = {
  title: 'Auto-UPI — Instant Payments',
  description: 'Fast, secure cross-border UPI payments and instant domestic bank settlements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
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
            </PaymentProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
