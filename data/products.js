
export const rarity = {
  common:    { label:"COMMON",    weight:60, color:"#aaaaaa", glow:"rgba(170,170,170,0.4)", bg:"rgba(170,170,170,0.08)", border:"rgba(170,170,170,0.3)", badgeBg:"#333"    },
  rare:      { label:"RARE",      weight:30, color:"#00D9FF", glow:"rgba(0,217,255,0.5)",   bg:"rgba(0,217,255,0.08)",   border:"rgba(0,217,255,0.4)",   badgeBg:"#001a25" },
  legendary: { label:"LEGENDARY", weight:10, color:"#FFD700", glow:"rgba(255,215,0,0.7)",   bg:"rgba(255,215,0,0.1)",    border:"rgba(255,215,0,0.6)",   badgeBg:"#1a1200" },
};

export const snacks = [
  // COMMON
  { id: 1,  name: "Lays Original",               image: "/snacks/lays-original.png",                        country: "🇺🇸", rarity: "common",    value: "$1.50",  numericValue: 1.50, multiple: 25 },
  { id: 2,  name: "Mister Potato",                image: "/snacks/mister-potato.webp",                       country: "🇲🇾", rarity: "common",    value: "$1.80",  numericValue: 1.80, multiple: 25 },
  { id: 3,  name: "Julie's Biscuits",             image: "/snacks/julies-biscuits.png",                      country: "🇲🇾", rarity: "common",    value: "$2.00",  numericValue: 2.00, multiple: 20 },
  { id: 4,  name: "Tam Tam Crackers",             image: "/snacks/tam-tam.jpg",                              country: "🇸🇬", rarity: "common",    value: "$1.20",  numericValue: 1.20, multiple: 25 },
  { id: 5,  name: "Irvins Potato Chips",          image: "/snacks/SaltedEggPotatoChips_SEPC95_1300x1300px.jpg",country: "🇸🇬", rarity: "common",    value: "$2.50",  numericValue: 2.50, multiple: 20 },
  { id: 19, name: "Eclipse Mints",                image: "/snacks/eclipse-mints.png",                        country: "🇸🇬", rarity: "common",    value: "$1.50",  numericValue: 1.50, multiple: 20 },
  // RARE
  { id: 6,  name: "Crispy M&M's",                 image: "/snacks/crispy-mms.jpg",                           country: "🇺🇸", rarity: "common",      value: "$4.50",  numericValue: 4.50, multiple: 20 },
  { id: 7,  name: "Skittles Wild Berry",          image: "/snacks/skittles-wild-berry.png",                  country: "🇺🇸", rarity: "common",      value: "$3.80",  numericValue: 3.80, multiple: 20 },
  { id: 8,  name: "Hello Panda Matcha",           image: "/snacks/hello-panda-matcha.jpg",                   country: "🇯🇵", rarity: "common",      value: "$5.00",  numericValue: 5.00, multiple: 15 },
  { id: 9,  name: "Irvins Salted Egg Fish Skin",  image: "/snacks/SaltedEggFishSkin_SEFS210_1300x1300px.jpg",  country: "🇸🇬", rarity: "rare",      value: "$8.00",  numericValue: 8.00, multiple: 10 },
  { id: 20, name: "Vietnam Cashews",              image: "/snacks/cashews.jpg",                              country: "🇻🇳", rarity: "rare",      value: "$6.50",  numericValue: 6.50, multiple: 15 },
  // EPIC
  { id: 10, name: "Pocky Champagne",              image: "/snacks/pocky-champagne.jpg",                      country: "🇯🇵", rarity: "rare",      value: "$9.90",  numericValue: 9.90, multiple: 10 },
  { id: 11, name: "Royce Nama Choco",             image: "/snacks/royce-nama-choco.jpg",                     country: "🇯🇵", rarity: "rare",      value: "$12.00", numericValue: 12.00, multiple: 10 },
  { id: 12, name: "Korean Fire Noodles",          image: "/snacks/korean-fire-noodles.jpg",                  country: "🇰🇷", rarity: "rare",      value: "$8.50",  numericValue: 8.50, multiple: 10 },
  { id: 13, name: "Taiwan Pineapple Cake",        image: "/snacks/taiwan-pineapple-cake.jpg",                country: "🇹🇼", rarity: "rare",      value: "$11.00", numericValue: 11.00, multiple: 10 },
  // LEGENDARY
  { id: 14, name: "Wagyu Beef Jerky",             image: "/snacks/royce-nama-choco.jpg",                     country: "🇯🇵", rarity: "legendary", value: "$22.00", numericValue: 22.00, multiple: 8 },
  { id: 15, name: "Kinder Bueno White",           image: "/snacks/kinder-bueno-white.jpg",                   country: "🇩🇪", rarity: "legendary", value: "$18.00", numericValue: 18.00, multiple: 10 },
  { id: 16, name: "Matcha KitKat Box",            image: "/snacks/matcha-kitkat.jpg",                        country: "🇯🇵", rarity: "legendary", value: "$25.00", numericValue: 25.00, multiple: 5 },
  // ULTRA
  { id: 17, name: "Meiji Premium Choco",          image: "/snacks/meiji-premium-choco.jpg",                  country: "🇯🇵", rarity: "legendary",     value: "$45.00", numericValue: 45.00, multiple: 3 },
  { id: 18, name: "Taiwan Bubble Tea Kit",        image: "/snacks/pocky-champagne.jpg",                      country: "🇹🇼", rarity: "legendary",     value: "$38.00", numericValue: 38.00, multiple: 3 },
]