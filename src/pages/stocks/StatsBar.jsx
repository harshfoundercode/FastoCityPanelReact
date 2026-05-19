// src/pages/stocks/components/StatsBar.jsx
import React from 'react';
import {
  Layers,
  Package,
  AlertTriangle,
  ShoppingCart,
  Folder,
  Grid3X3,
} from 'lucide-react';

const StatChip = ({ icon: Icon, label, value, color, bg }) => (
  <div
    className="flex items-center gap-2 px-3 py-2 rounded-xl border"
    style={{ backgroundColor: bg, borderColor: `${color}30` }}
  >
    <Icon size={15} style={{ color }} />
    <div>
      <p className="text-sm font-extrabold leading-tight" style={{ color }}>{value}</p>
      <p className="text-xs leading-tight" style={{ color: `${color}99` }}>{label}</p>
    </div>
  </div>
);

export const StatsBar = ({ stats }) => {
  const chips = [
    { icon: Grid3X3, label: 'Main Categories', value: stats.totalMainCategories, color: '#1565C0', bg: '#E3F2FD' },
    { icon: Folder, label: 'Categories', value: stats.totalCategories, color: '#1565C0', bg: '#E3F2FD' },
    { icon: Package, label: 'Products', value: stats.totalProducts, color: '#14532D', bg: '#F0FDF4' },
    { icon: Layers, label: 'Total Stock', value: stats.totalStock, color: '#374151', bg: '#F3F4F6' },
    { icon: AlertTriangle, label: 'Low Stock', value: stats.lowStockCount, color: '#E65100', bg: '#FFF3E0' },
    { icon: ShoppingCart, label: 'Out of Stock', value: stats.outOfStockCount, color: '#C62828', bg: '#FFEBEE' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2.5 overflow-x-auto">
      <div className="flex gap-2">
        {chips.map((chip, i) => (
          <StatChip key={i} {...chip} />
        ))}
      </div>
    </div>
  );
};