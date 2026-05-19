// src/pages/stocks/components/AppHeader.jsx
import React from 'react';

export const AppHeader = ({ title, subtitle, actions }) => (
  <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-center">
    <div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
    </div>
    <div className="flex-1" />
    {actions}
  </div>
);