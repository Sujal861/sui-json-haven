
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardChartProps {
  timeRange: 'day' | 'week' | 'month';
}

const DashboardChart = ({ timeRange }: DashboardChartProps) => {
  // Generate mock data based on time range
  const generateData = () => {
    switch (timeRange) {
      case 'day':
        return Array.from({ length: 24 }, (_, i) => ({
          name: `${i}:00`,
          creates: Math.floor(Math.random() * 5),
          updates: Math.floor(Math.random() * 8),
          reads: Math.floor(Math.random() * 12)
        }));
      case 'week':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
          name: day,
          creates: Math.floor(Math.random() * 10),
          updates: Math.floor(Math.random() * 15),
          reads: Math.floor(Math.random() * 25)
        }));
      case 'month':
        return Array.from({ length: 30 }, (_, i) => ({
          name: `${i + 1}`,
          creates: Math.floor(Math.random() * 8),
          updates: Math.floor(Math.random() * 12),
          reads: Math.floor(Math.random() * 20)
        }));
    }
  };

  const data = generateData();

  return (
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
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          tickLine={false}
          axisLine={{ stroke: '#374151' }}
        />
        <YAxis 
          stroke="#9CA3AF"
          tickLine={false}
          axisLine={{ stroke: '#374151' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111827', 
            borderColor: '#374151',
            color: '#F9FAFB'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="reads" 
          stackId="1"
          stroke="#4F46E5" 
          fill="#4F46E5" 
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="updates" 
          stackId="1"
          stroke="#10B981" 
          fill="#10B981" 
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="creates" 
          stackId="1"
          stroke="#3B82F6" 
          fill="#3B82F6" 
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
