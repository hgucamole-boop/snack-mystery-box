'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('myDrops');
    if (saved) setDrops(JSON.parse(saved));
  }, []);

  const totalValue = drops.reduce((sum, d) => sum + d.numericValue, 0);
  const rarityCounts = drops.reduce((acc, d) => {
    acc[d.rarity] = (acc[d.rarity] || 0) + 1;
    return acc;
  }, {});

  const rarityColors = {
    COMMON: '#FF6B35',
    RARE: '#00D9FF',
    EPIC: '#7B2FBE',
    LEGENDARY: '#FFD700',
    ULTRA: '#FF2E63',
  };

  const clearDrops = () => {
    localStorage.removeItem('myDrops');
    setDrops([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body px-6 py-6">
      
      {/* Header */}
      <div className="text-center mb-10 pt-10">
        <h1 className="font-display text-5xl md:text-6xl text-gold">MY HAUL</h1>
        <p className="text-cyan">{drops.length} drops opened</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
        <div className="bg-card border border-gold p-5 text-center rounded-lg">
          <div className="font-display text-3xl text-gold">{drops.length}</div>
          <div className="text-muted-foreground">Total Drops</div>
        </div>
        <div className="bg-card border border-cyan p-5 text-center rounded-lg">
          <div className="font-display text-3xl text-cyan">${totalValue.toFixed(2)}</div>
          <div className="text-muted-foreground">Total Value</div>
        </div>
        <div className="bg-card border border-pink p-5 text-center rounded-lg">
          <div className="font-display text-3xl text-pink">{rarityCounts['ULTRA'] || 0}</div>
          <div className="text-muted-foreground">Ultra Pulls</div>
        </div>
        <div className="bg-card border border-purple p-5 text-center rounded-lg">
          <div className="font-display text-3xl text-purple">{rarityCounts['LEGENDARY'] || 0}</div>
          <div className="text-muted-foreground">Legendaries</div>
        </div>
      </div>

      {/* Rarity breakdown */}
      {drops.length > 0 && (
        <div className="max-w-5xl mx-auto mb-10 bg-card p-5 border border-border rounded-lg">
          <h3 className="font-display text-gold mt-0 mb-4">RARITY BREAKDOWN</h3>
          {Object.entries(rarityCounts).map(([rarity, count]) => (
            <div key={rarity} className="flex items-center gap-3 mb-2">
              <span className="w-24 text-sm" style={{ color: rarityColors[rarity] }}>{rarity}</span>
              <div className="flex-1 bg-background h-5 relative rounded-sm overflow-hidden">
                <div style={{
                  width: `${(count / drops.length) * 100}%`,
                  height: '100%',
                  background: rarityColors[rarity],
                  opacity: 0.7
                }} />
              </div>
              <span className="w-8 text-muted-foreground text-sm">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Drop history */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-gold m-0">DROP HISTORY</h3>
          {drops.length > 0 && (
            <button onClick={clearDrops} className="bg-transparent border border-pink text-pink px-3 py-1.5 cursor-pointer">
              CLEAR ALL
            </button>
          )}
        </div>

        {drops.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-5xl">📦</p>
            <p>No drops yet. Go open some cases!</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {[...drops].reverse().map((drop, i) => (
              <div key={i} className="flex items-center gap-4 bg-card px-4 py-3 border border-border rounded-lg">
                <img src={drop.image} alt={drop.name} className="w-12 h-12 object-contain" />
                <div className="flex-1">
                  <div className="text-cream">{drop.name}</div>
                  <div className="text-muted-foreground text-xs">{drop.country} · {new Date(drop.openedAt).toLocaleDateString()}</div>
                </div>
                <span className="px-2 py-0.5 text-xs border" style={{ color: rarityColors[drop.rarity], borderColor: rarityColors[drop.rarity] }}>
                  {drop.rarity}
                </span>
                <span className="text-gold">{drop.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="text-center mt-10 flex gap-4 justify-center flex-wrap">
        <Link href="/drop" className="px-8 py-3 bg-primary text-white no-underline font-bold rounded">
          🎰 OPEN MORE DROPS
        </Link>
        <Link href="/" className="px-8 py-3 border border-cyan text-cyan no-underline rounded">
          🏠 HOME
        </Link>
      </div>
    </div>
  );
}