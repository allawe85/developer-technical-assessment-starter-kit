import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriceChartProps {
  currentPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ currentPrice }) => {
  // Generate 6 months of mock trend data based on the current price
  const data = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    // Create a trend that ends near the current price with some variation
    return months.map((month, index) => {
      // eslint-disable-next-line react-hooks/purity
      const variation = Math.random() * 0.1 - 0.05; // +/- 5% variation
      // Trend upwards slightly over time to look positive
      const trendFactor = 0.95 + (index * 0.01); 
      const price = Math.round(currentPrice * trendFactor * (1 + variation));
      return {
        name: month,
        price: price,
      };
    });
  }, [currentPrice]);

  return (
    <div className="w-full h-[300px] bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm">
      <h3 className="text-lg font-bold text-ohb-dark dark:text-white mb-4">Price History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: '#334155', 
                color: '#f8fafc',
                borderRadius: '8px'
            }}
            itemStyle={{ color: '#C5A059' }}
            formatter={(value: number) => [`OMR ${value.toLocaleString()}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#C5A059"
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};