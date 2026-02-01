import React from 'react';
import { Card, CardContent } from '../ui/Card';

export default function StatsCard({ label, value, icon: Icon, iconColor = 'text-green-600', valueColor = 'text-gray-900' }) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
          {Icon && <Icon className={`w-8 h-8 ${iconColor}`} />}
        </div>
      </CardContent>
    </Card>
  );
}

