export const metadata = {
  title: 'Snack Mystery Box - Weekly Surprise Snack Subscriptions',
  description: 'Discover rare imported snacks and drinks at 60-80% off. Weekly blind boxes delivered to your door. Fight food waste while exploring global flavors.',
  keywords: 'snack subscription, mystery box, imported snacks, food waste, cheap snacks, blind box',
  openGraph: {
    title: 'Snack Mystery Box',
    description: 'Weekly surprise snack boxes at unbeatable prices',
    type: 'website',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
