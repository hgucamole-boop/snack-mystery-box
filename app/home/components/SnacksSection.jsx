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

import { categories } from '@/data/products';

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
  iconColor,
  onClick
}) => {
  const CategoryIcon = iconMap[icon] || NewReleasesIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full text-left cursor-pointer ${bgColor} rounded-xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl ${sizeClass}`}
    >
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
    </button>
  );
};

export function SnacksSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section className="py-28 px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="pantry-title mb-4">The Pantry Collection</h2>
        <div className="h-1 w-24 bg-tertiary rounded-full"></div>
      </div>
      <div className="bento-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            {...category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCategory.title} preview`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setSelectedCategory(null)}
            aria-label="Close modal"
          />

          <div
            className="relative w-full max-w-3xl rounded-2xl bg-surface-container-high p-6 md:p-8 shadow-2xl border border-outline-variant animate-[fadeIn_180ms_ease-out]"
            style={{ backgroundColor: 'var(--surface-container-high, #f6f7f4)' }}
          >
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest transition-colors"
              onClick={() => setSelectedCategory(null)}
              aria-label="Close"
            >
              <CloseIcon sx={{ fontSize: '1.1rem' }} />
            </button>

            <div className="pr-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tertiary mb-2">Category Preview</p>
              <h3 className="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-3">{selectedCategory.title}</h3>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                {selectedCategory.description || 'A handpicked mix from this category, curated for surprise value and premium quality in every mystery box.'}
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
                {selectedCategory.sampleImages?.slice(0, 6).map((sampleItem, index) => {
                  const imageUrl = typeof sampleItem === 'string' ? sampleItem : sampleItem.image;
                  const imageName = typeof sampleItem === 'string' ? null : sampleItem.name;
                  
                  return (
                    <div
                      key={`${selectedCategory.id}-sample-${index}`}
                      className="relative group"
                    >
                      <img
                        src={imageUrl}
                        alt={imageName || `${selectedCategory.title} sample ${index + 1}`}
                        className="h-16 w-full sm:h-20 rounded-lg object-contain border border-outline-variant cursor-pointer transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                      {imageName && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-surface-dim text-on-surface text-xs font-medium rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-lg">
                          {imageName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Link
                href="/gacha"
                className="cta-button inline-block mt-4 px-8 py-3 text-center"
                style={{ animation: 'none' }}
              >
                Start the Mystery Pull
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
