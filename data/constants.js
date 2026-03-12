export const plans = [
  {
    id: 'starter',
    name: 'Starter Crew',
    price: '$99.99',
    pax: '5–10 pax',
    perHead: 'As low as $10/head',
    description: 'Perfect for small teams, friend groups, or cozy office pods. A monthly drop of global snacks to keep the good vibes flowing.',
    emoji: '🧑‍🤝‍🧑',
    tag: null,
    popular: false,
  },
  {
    id: 'team',
    name: 'Full Squad',
    price: '$179.99',
    pax: '10–20 pax',
    perHead: 'As low as $9/head',
    description: 'Built for growing teams and busy offices. A generous monthly haul of imported treats that disappears from the pantry in minutes.',
    emoji: '🏢',
    tag: 'BEST VALUE',
    popular: true,
  },
  {
    id: 'office',
    name: 'Office Legend',
    price: '$349.99',
    pax: '30+ pax',
    perHead: 'Bulk savings unlocked',
    description: 'Go big or go home. A massive monthly mystery box that turns your office pantry into the most talked-about spot in the building.',
    emoji: '🏆',
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
    image: '/images/collect-placeholder.jpg',
    alt: 'Team collecting surplus food from supermarket'
  },
  {
    icon: '📦',
    title: 'We Repackage',
    desc: 'Our expert team carefully curates and repackages each item into exciting mystery boxes. Quality control ensures every snack meets our standards.',
    image: '/images/repackage-placeholder.jpg',
    alt: 'Team repackaging snacks into mystery boxes'
  },
  {
    icon: '🚚',
    title: 'We Deliver',
    desc: 'Fresh boxes arrive at your office doorstep, turning surplus into surprise. Your team gets global treats while we fight food waste together.',
    image: '/images/deliver-placeholder.jpg',
    alt: 'Delivery team bringing boxes to office'
  }
];

export const sustainabilityStory = {
  title: "From Surplus to Surprise: Our Mission in Action",
  subtitle: "Every mystery box tells a story of sustainability, community, and delicious discovery.",
  impact: "Together, we're keeping millions of snacks out of landfills while bringing joy to office pantries worldwide."
};

