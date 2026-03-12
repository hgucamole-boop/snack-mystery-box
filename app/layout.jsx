import '@/styles/globals.css';

import GTMProvider from "@/app/components/GTMProvider"

export const metadata = {
  title: 'Snack Mystery Box - Surprise Snack Subscriptions for your office',
  description: 'Discover rare imported snacks and drinks at 40-60% off.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
      <GTMProvider>
          {children}
      </GTMProvider>
      </body>
    </html>
  );
}