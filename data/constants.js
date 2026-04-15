export const plans = [
  {
    id: 'starter',
    name: 'Starter Crew',
    unitMultiplier: 1,
    price: 'S$199.99',
    pax: '5-10 pax',
    caption: 'For startups',
    perHead: 'As low as S$10/head',
    description: 'Perfect for small teams, friend groups, or cozy office pods. A monthly drop of global snacks to keep the good vibes flowing.',
    emoji: '/icons/costumer.svg',
    emojiSelected: '/icons/costumer_yellow.svg',
    tag: null,
    popular: false,
  },
  {
    id: 'team',
    name: 'Full Squad',
    unitMultiplier: 2,
    price: 'S$259.99',
    pax: '10-20 pax',
    caption: 'Growing teams',
    perHead: 'As low as S$9/head',
    description: 'Built for growing teams and busy offices. A generous monthly haul of imported treats that disappears from the pantry in minutes.',
    emoji: '/icons/workplace.svg',
    emojiSelected: '/icons/workplace_yellow.svg',
    tag: 'BEST VALUE',
    popular: true,
  },
  {
    id: 'office',
    name: 'Office Legend',
    unitMultiplier: 3,
    price: 'S$319.99',
    pax: '30-50 pax',
    caption: 'Large offices',
    perHead: 'Bulk savings unlocked',
    description: 'Go big or go home. A massive monthly mystery box that turns your office pantry into the most talked-about spot in the building.',
    emoji: '/icons/trophy.svg',
    emojiSelected: '/icons/trophy_yellow.svg',
    tag: null,
    popular: false,
  }
];

export const features = [
  { icon: '📦', title: 'Mystery Boxes', desc: 'Curated surprises delivered to your door' },
  { icon: '🌍', title: 'Global Snacks', desc: 'Treats from around the world' },
  { icon: '💰', title: 'Unbeatable Value', desc: 'Save 40-60% on retail prices' },
  { icon: '♻️', title: 'Fight Food Waste', desc: 'Near-expiry doesn\'t mean bad quality' },
  { icon: '🎁', title: 'Always Different', desc: 'New discoveries every delivery' },
  { icon: '🚚', title: 'Zero Effort', desc: 'No hunting, just unboxing joy' }
];

export const sustainabilityPoints = [
  {
    icon: '🛒',
    title: 'We Collect',
    desc: 'Partnering with supermarkets and suppliers to rescue quality food before it goes to waste. Every day, we save tons of perfectly good snacks from landfills.',
    image: '/images/snackRescue.jpg',
    alt: 'Team collecting surplus food from supermarket'
  },
  {
    icon: '📦',
    title: 'We Repackage',
    desc: 'Our expert team carefully curates and repackages each item into exciting mystery boxes. Quality control ensures every snack meets our standards.',
    image: '/images/diverted.jpg',
    alt: 'Team repackaging snacks into mystery boxes'
  },
  {
    icon: '🚚',
    title: 'We Deliver',
    desc: 'Fresh boxes arrive at your office doorstep, turning surplus into surprise. Your team gets global treats while we fight food waste together.',
    image: '/images/delivery.jpg',
    alt: 'Delivery team bringing boxes to office'
  }
];

export const sustainabilityStory = {
  title: "From Surplus to Surprise: Our Mission in Action",
  subtitle: "Every mystery box tells a story of sustainability, community, and delicious discovery.",
  impact: "Together, we're keeping millions of snacks out of landfills while bringing joy to office pantries worldwide."
};

export const images = {
  sustainability: {
    snackRescue: "/images/snackRescue.jpg",
    delivery: "/images/delivery.jpg",
    diverted: "/images/diverted.jpg",
  }
}

