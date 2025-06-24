import React from 'react';

export default function QuickBar({ inventory, onItemUse }) {
  // Sadece Food ve Toy tipi eşyaları filtrele
  const usableItems = inventory.filter(inv => 
    (inv.item.itemType === "Food" || inv.item.itemType === "Toy") && inv.quantity > 0
  );

  if (usableItems.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
        <p className="text-gray-400 text-sm text-center">Kullanılabilir eşya yok</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
      <h3 className="text-cyan-300 font-semibold mb-2 text-sm">Hızlı Kullanım</h3>
      <div className="flex gap-2 flex-wrap">
        {usableItems.map((inv) => (
          <div 
            key={inv.item.id} 
            onClick={() => onItemUse(inv.item.id)}
            className="relative w-16 h-16 bg-slate-700/50 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-cyan-400 transition-all transform hover:scale-110"
            title={`${inv.item.name} (${inv.quantity} adet)`}
          >
            <img src={inv.item.imageUrl} alt={inv.item.name} className="w-full h-full object-contain p-1" />
            <span className="absolute bottom-0 right-0 bg-cyan-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {inv.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 