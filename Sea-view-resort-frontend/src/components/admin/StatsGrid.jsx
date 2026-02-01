import React from 'react';

export default function StatsGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {children}
    </div>
  );
}

