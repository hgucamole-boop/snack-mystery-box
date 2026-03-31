'use client';
import { useState } from 'react';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import CookieIcon from '@mui/icons-material/Cookie';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CoffeeIcon from '@mui/icons-material/Coffee';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import CakeIcon from '@mui/icons-material/Cake';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const iconMap = {
  cookie: CookieIcon,
  local_drink: LocalDrinkIcon,
  coffee: CoffeeIcon,
  emoji_food_beverage: EmojiFoodBeverageIcon,
  cake: CakeIcon,
  new_releases: NewReleasesIcon,
};

const CategoryCard = ({ 
  id,
  title, 
  description, 
  icon, 
  image, 
  buttonText,
  sizeClass,
  bgColor,
  iconBgColor,
  iconColor
}) => {
  const CategoryIcon = iconMap[icon] || NewReleasesIcon;

  return (
    <div className={`group relative block cursor-pointer ${bgColor} rounded-xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl ${sizeClass}`}>
      <img 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" 
        src={image}
      />
      {id === 'new-arrivals' && (
        <div className="absolute inset-0 opacity-90" style={{
          background: 'linear-gradient(to right, rgba(4, 51, 38, 0.9), rgba(53, 109, 83, 0.83), rgba(76, 160, 122, 0.75))'
        }}></div>
      )}
      <div className={`relative p-8 h-full flex flex-col ${sizeClass?.includes('large') || sizeClass?.includes('tall') ? 'justify-between' : 'justify-end'}`}>
        <div>
          <div className={`w-10 h-10 ${iconBgColor} bg-[#2f855a] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <CategoryIcon className={`${iconColor} text-white`} sx={{ fontSize: '1.05rem' }} />
          </div>
          <h3 className={`font-headline text-2xl font-bold mb-2 ${id === 'new-arrivals' ? 'text-white' : ''}`}>{title}</h3>
          {description && (
            <p className={`max-w-sm mb-4 leading-relaxed ${id === 'new-arrivals' ? 'text-white' : 'text-on-surface-variant'}`}>{description}</p>
          )}
          <span
            className={`inline-flex items-center font-bold group-hover:gap-4 transition-all ${id === 'new-arrivals' ? 'text-white' : 'text-secondary'}`}
          >
            {buttonText}
            <ArrowForwardIcon className="ml-2" sx={{ fontSize: '1rem' }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export function SnacksSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const categories = [
    {
      id: 'snacks',
      title: 'Snacks',
      description: 'Artisanally crafted crunchy and savory delights for any time of day.',
      icon: 'cookie',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdr-zSme632yYz1Od8O4toM0Gx-OzUmGlaklCTgyRd1gRhm12-UbKoo-k89bURh64hAlEuGLsPmKM-7U7RDp5YB1i7tXV5L5LzR_8ZCMBVmbAnAJI3BYvTqPPub3qIbGlUeTNbwdZ8c3HTS_sw9i9hpum-3poGyn4QGD4dsXIT7OuWTZWd89Gru7s_2hVm_r7idTvkjyFWihWP-441p-re_Lf0hPCI6mdJAjmKN70rjqXZoINLuEnoX8JVXw1RuWk0rDC135I6FwKA',
      buttonText: 'Shop Snacks',
      sizeClass: 'bento-item-large',
      bgColor: 'bg-surface-container',
      iconBgColor: 'bg-secondary-fixed',
      iconColor: 'text-on-secondary-fixed-variant',
      sampleImages: [
        'https://images.unsplash.com/photo-1599599810694-b5ac4dd1a2a3?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1599599810989-d1a4934e7c9a?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1583053757904-d3e6e6b5eaaa?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559599810-46d1c41174ca?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1599599810667-8e2c6b78a2f4?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1599599811001-a3afc9e3f10d?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 'drinks',
      title: 'Drinks',
      description: 'Refreshing botanical infusions and natural sparkling tonics.',
      icon: 'local_drink',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKBGpZDdIvVyBtR5fPz8OX8ppdbak3gSf9UZa-QfN7Uv9LnepdNdBq_MII8cXiBHuYojOIrdvY0VwJcZFm0vJ_e5PwK5n7It5wFDc9LtDez3ztwkpa7hsaFXM_tO_snXYzEgu3o-bZ021ZV79Vi5hol-zD-dcE8Sn0BUavfp2lxwuK0Ll8IVcMx6nqlQ8LE9mtFZFO6-wMogcxlAM7WeMYcTD7sPKJhqf2pGRlVsZLJAuNOYCw-aD55vX6by8dxDYXEOKlsrn5NQ4K',
      buttonText: 'Shop Drinks',
      sizeClass: 'bento-item-tall',
      bgColor: 'bg-surface-container-low',
      iconBgColor: 'bg-primary-fixed',
      iconColor: 'text-on-primary-fixed-variant',
      sampleImages: [
        'https://images.unsplash.com/photo-1556742212-5b321f3c261d?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551632786-de41fde901c9?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1600788148184-403f7691d7d0?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1590741657129-826653500f72?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1587619002835-17d193fb7ecc?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1605519827010-7d1baed65e8c?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 'coffee',
      title: 'Coffee Pods',
      description: null,
      icon: 'coffee',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOIw56Z-2iLlm-tfmkpiUqqT59bx5rIfJ426MspeVyM3EIz2C_zBkR5rQ24aoA6rcA06R4f-GnAIM_HyJa5nGfQUQT88YfjOqRD3HR1LLRzV9xeV8QVkZzqGKEzMG5BxWrUaWtriqwdtA6DeU2C540aSc_LjNMwZVx48Xv__ZoBZi6qGDQOA81yMIWG_hLxG39WIdBT9mTTBLzzQSztBJan41dqRjQ6WQyBNxr5nTrl-aplHcTjfYHJ8JOzYh-aVr94fLlhQ5xKiag',
      buttonText: 'Shop Coffee',
      sizeClass: '',
      bgColor: 'bg-surface-container',
      iconBgColor: 'bg-tertiary-fixed',
      iconColor: 'text-on-tertiary-fixed-variant',
      sampleImages: [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1447933601403-0c6688bcda7d?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1512568400610-62da47e1b7d0?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1609707236089-38ad01f28e04?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1491521271698-edde440a6230?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1442512595331-e89e6920582f?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 'tea',
      title: 'Tea Bags',
      description: null,
      icon: 'emoji_food_beverage',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs1bygmYHxH9lhdeSHAh4KSKetKgQ4CFqeRedPdCIUf2Qdbpk7n1FGP_YJ454n1nKgNVUdQZqM9MTmEz6aUtqGjjHsBhmbyR0S9GB0JUgcUoh7ITGM_Jt72w49gwdyBEo8Kzr4XxFmw1NFcKZaVaDBWuX4ZxVBSGXTDv0wCyzgd-cnZcNgdJH4zWnOL9LEmIKoC_xqcUCAN0zFxNaqisHVeYNMuPoMI306I_xdQq2l6vEj1G_Wtgi1AfiCNXse4v6ad13g0cSF2LtJ',
      buttonText: 'Shop Teas',
      sizeClass: '',
      bgColor: 'bg-surface-container-low',
      iconBgColor: 'bg-secondary-fixed-dim',
      iconColor: 'text-on-secondary-fixed-variant',
      sampleImages: [
        'https://images.unsplash.com/photo-1597318346121-4dd7ac277d1c?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1564876694728-f1d206a88370?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1597318235702-64f2dda46e3a?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1576092160562-40b08422138c?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1597318357657-53f38d932ab7?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1597318357685-6d9b7c5c1247?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 'sweets',
      title: 'Sweet Treats',
      description: null,
      icon: 'cake',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm7XmXItOiBEsyQIe8SrmC8N_88Blw4eAdDju7AMfzVDYCkLsf40IfVZ38PqnofvMSzZzYBhJguWtMZPUmB51U6TZxOfpSXF3rr9xy4obWIf_mYQZE45eaXxC3pgrHuxp1tDQq0_7wXGQEucGBPCSBa92yBicZsfOWx2d9Z38xHPPu5xMlhtd1vuKTZUmlaieky9IaepBQeXNpifp7rjg2uo736rWKuuQ498nEQp4SgFiULs2b31NNe2J69MzC5cLE1_AnAe67R8dB',
      buttonText: 'Shop Sweets',
      sizeClass: '',
      bgColor: 'bg-surface-container',
      iconBgColor: 'bg-tertiary-fixed-dim',
      iconColor: 'text-on-tertiary-fixed-variant',
      sampleImages: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1585518419759-8d36e6bbecc7?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1599599810694-b5ac4dd7d07a?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1599599811032-ad5f59fc0de9?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1599599810898-c9b3e3b7d9f9?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 'new-arrivals',
      title: 'New Arrivals',
      description: 'The latest seasonal harvests and experimental small batches, direct from our partners.',
      icon: 'new_releases',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfjEKFeY-iEdcUZYCxm-0TPLsORZvU1avdvumwYZ66G76QDK2cKeEoBs9MTbl1Kg5tDZfeXbKKrCnKyTMg066p3T_JXIyo_Uwy7dU2_qeoE3q4IBdYOXbktECvh0RmbuETU9Ne1BsA21pPnO8DAV4oGTahY4LEWdkMisY1Z95K1QTbwL7mvlpml1E16ur7YBPrz8QAqf0id8lG3bOYDDvlt2F8SuwsNQKTSsar18wHmT-MJFc_Qc3e8BffxJ1BKSDwZMREpMEsiEUj',
      buttonText: 'Explore Now',
      sizeClass: 'bento-item-large',
      bgColor: 'bg-primary-container',
      iconBgColor: 'bg-surface-container-highest',
      iconColor: 'text-primary text-3xl',
      sampleImages: [
        'https://images.unsplash.com/photo-1599599810694-b5ac4dd7d07a?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1556742212-5b321f3c261d?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1597318235702-64f2dda46e3a?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1585518419759-8d36e6bbecc7?w=300&h=300&fit=crop',
      ],
    },
  ];

  return (
    <section className="py-28 px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="font-headline text-4xl font-extrabold text-primary mb-4">The Pantry Collection</h2>
        <div className="h-1 w-24 bg-tertiary rounded-full"></div>
      </div>
      <div className="bento-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            {...category}
          />
        ))}
      </div>
    </section>
  );
}
