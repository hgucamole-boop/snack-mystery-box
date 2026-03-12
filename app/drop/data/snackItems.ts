export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'ULTRA';

export interface SnackItemData {
  id: number;
  name: string;
  image: string;
  country: string;
  rarity: Rarity;
  value: string;
  numericValue: number;
}

export const snackItems: SnackItemData[] = [
  // COMMON
  { id: 1,  name: "Lays Original",               image: "/snacks/lays-original.png",                        country: "🇺🇸", rarity: "COMMON",    value: "$1.50",  numericValue: 1.50 },
  { id: 2,  name: "Mister Potato",                image: "/snacks/mister-potato.webp",                       country: "🇲🇾", rarity: "COMMON",    value: "$1.80",  numericValue: 1.80 },
  { id: 3,  name: "Julie's Biscuits",             image: "/snacks/julies-biscuits.png",                      country: "🇲🇾", rarity: "COMMON",    value: "$2.00",  numericValue: 2.00 },
  { id: 4,  name: "Tam Tam Crackers",             image: "/snacks/tam-tam.jpg",                              country: "🇸🇬", rarity: "COMMON",    value: "$1.20",  numericValue: 1.20 },
  { id: 5,  name: "Irvins Potato Chips",          image: "/snacks/SaltedEggPotatoChips_SEPC95_1300x1300px.jpg",country: "🇸🇬", rarity: "COMMON",    value: "$2.50",  numericValue: 2.50 },
  { id: 19, name: "Eclipse Mints",                image: "/snacks/eclipse-mints.png",                        country: "🇸🇬", rarity: "COMMON",    value: "$1.50",  numericValue: 1.50 },
  // RARE
  { id: 6,  name: "Crispy M&M's",                 image: "/snacks/crispy-mms.jpg",                           country: "🇺🇸", rarity: "RARE",      value: "$4.50",  numericValue: 4.50 },
  { id: 7,  name: "Skittles Wild Berry",          image: "/snacks/skittles-wild-berry.png",                  country: "🇺🇸", rarity: "RARE",      value: "$3.80",  numericValue: 3.80 },
  { id: 8,  name: "Hello Panda Matcha",           image: "/snacks/hello-panda-matcha.jpg",                   country: "🇯🇵", rarity: "RARE",      value: "$5.00",  numericValue: 5.00 },
  { id: 9,  name: "Irvins Salted Egg Fish Skin",  image: "/snacks/SaltedEggFishSkin_SEFS210_1300x1300px.jpg",  country: "🇸🇬", rarity: "RARE",      value: "$8.00",  numericValue: 8.00 },
  { id: 20, name: "Vietnam Cashews",              image: "/snacks/cashews.jpg",                              country: "🇻🇳", rarity: "RARE",      value: "$6.50",  numericValue: 6.50 },
  // EPIC
  { id: 10, name: "Pocky Champagne",              image: "/snacks/pocky-champagne.jpg",                      country: "🇯🇵", rarity: "EPIC",      value: "$9.90",  numericValue: 9.90 },
  { id: 11, name: "Royce Nama Choco",             image: "/snacks/royce-nama-choco.jpg",                     country: "🇯🇵", rarity: "EPIC",      value: "$12.00", numericValue: 12.00 },
  { id: 12, name: "Korean Fire Noodles",          image: "/snacks/korean-fire-noodles.jpg",                  country: "🇰🇷", rarity: "EPIC",      value: "$8.50",  numericValue: 8.50 },
  { id: 13, name: "Taiwan Pineapple Cake",        image: "/snacks/taiwan-pineapple-cake.jpg",                country: "🇹🇼", rarity: "EPIC",      value: "$11.00", numericValue: 11.00 },
  // LEGENDARY
  { id: 14, name: "Wagyu Beef Jerky",             image: "/snacks/royce-nama-choco.jpg",                     country: "🇯🇵", rarity: "LEGENDARY", value: "$22.00", numericValue: 22.00 },
  { id: 15, name: "Kinder Bueno White",           image: "/snacks/kinder-bueno-white.jpg",                   country: "🇩🇪", rarity: "LEGENDARY", value: "$18.00", numericValue: 18.00 },
  { id: 16, name: "Matcha KitKat Box",            image: "/snacks/matcha-kitkat.jpg",                        country: "🇯🇵", rarity: "LEGENDARY", value: "$25.00", numericValue: 25.00 },
  // ULTRA
  { id: 17, name: "Meiji Premium Choco",          image: "/snacks/meiji-premium-choco.jpg",                  country: "🇯🇵", rarity: "ULTRA",     value: "$45.00", numericValue: 45.00 },
  { id: 18, name: "Taiwan Bubble Tea Kit",        image: "/snacks/pocky-champagne.jpg",                      country: "🇹🇼", rarity: "ULTRA",     value: "$38.00", numericValue: 38.00 },
];

export const rarityColors: Record<Rarity, string> = {
  COMMON:    'orange',
  RARE:      'cyan',
  EPIC:      'purple',
  LEGENDARY: 'gold',
  ULTRA:     'pink',
};

export const rarityProbabilities: Record<Rarity, number> = {
  COMMON:    50,
  RARE:      30,
  EPIC:      14,
  LEGENDARY: 5,
  ULTRA:     1,
};

export const caseConfig = {
  snack_crate: {
    name: 'Starter Crew',
    emoji: '🧑‍🤝‍🧑',
    price: 99.99,
    hot: false,
    pax: '5–10 pax',
    perHead: 'As low as $10/head',
    rarities: ['COMMON', 'RARE', 'EPIC'] as Rarity[],
    weights: { COMMON: 60, RARE: 30, EPIC: 10 },
  },
  premium_box: {
    name: 'Full Squad',
    emoji: '🏢',
    price: 179.99,
    hot: true,
    pax: '10–20 pax',
    perHead: 'As low as $9/head',
    rarities: ['RARE', 'EPIC', 'LEGENDARY'] as Rarity[],
    weights: { RARE: 50, EPIC: 35, LEGENDARY: 15 },
  },
  legend_drop: {
    name: 'Office Legend',
    emoji: '🏆',
    price: 349.99,
    hot: false,
    pax: '30+ pax',
    perHead: 'Bulk savings unlocked',
    rarities: ['EPIC', 'LEGENDARY', 'ULTRA'] as Rarity[],
    weights: { EPIC: 60, LEGENDARY: 35, ULTRA: 5 },
  },
};

export function getItemsByRarity(rarity: Rarity): SnackItemData[] {
  return snackItems.filter(item => item.rarity === rarity);
}

export function getRandomItemForCase(caseType: keyof typeof caseConfig): SnackItemData {
  const config = caseConfig[caseType];
  const weights = config.weights as Record<string, number>;
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  let selectedRarity: Rarity = 'COMMON';
  for (const [rarity, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      selectedRarity = rarity as Rarity;
      break;
    }
  }

  const items = getItemsByRarity(selectedRarity);
  return items[Math.floor(Math.random() * items.length)];
}