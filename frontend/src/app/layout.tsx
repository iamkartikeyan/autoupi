import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'AutoUPI – Cross-Border Payments in 8 Seconds',
  description: 'Move money internationally with the simplicity of UPI and the transparency of a modern settlement network. 2% flat fee. Real-time cryptographic proof.',
  keywords: 'UPI, cross-border payment, international wire, remittances, instant settlement, fintech, blockchain ledger',
  icons: {
    icon: '/autoupi-logo.jpeg',
  },
  openGraph: {
    title: 'AutoUPI – Cross-Border Payments in 8 Seconds',
    description: 'Instant cross-border payment settlement layer with bank-grade security and cryptographic proof.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F19' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('autoupi_theme') || 'dark';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-primary-500/20 selection:text-primary-600 dark:selection:text-primary-300">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '500',
                padding: '10px 16px',
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
