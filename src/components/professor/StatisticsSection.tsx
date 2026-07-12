import React from 'react';
import { Users, Clock, BookOpen, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { PremiumCard } from '../PremiumCard';

export function StatisticsSection() {
  const metrics = [
    { label: 'Total Active Students', value: '1,492', change: '+12%', trend: 'up', icon: <Users size={20} className="text-[#4A0E1B]" /> },
    { label: 'Avg. Session Duration', value: '42m', change: '+5%', trend: 'up', icon: <Clock size={20} className="text-[#8A6A16]" /> },
    { label: 'Resources Accessed', value: '8,341', change: '+24%', trend: 'up', icon: <BookOpen size={20} className="text-[#7C2532]" /> },
    { label: 'Bounce Rate', value: '12%', change: '-2%', trend: 'down', icon: <Activity size={20} className="text-[#6E5A2E]" /> }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 420 },
    { day: 'Tue', hours: 550 },
    { day: 'Wed', hours: 480 },
    { day: 'Thu', hours: 610 },
    { day: 'Fri', hours: 590 },
    { day: 'Sat', hours: 820 },
    { day: 'Sun', hours: 750 }
  ];
  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const topResources = [
    { name: 'JEE Advanced Rotational Dynamics', views: 1245, color: 'bg-[#4A0E1B]' },
    { name: 'Coordination Compounds PYQs', views: 982, color: 'bg-[#7C2532]' },
    { name: 'Electromagnetism Master Notes', views: 845, color: 'bg-[#C9A13B]' },
    { name: 'Quantum Chemistry Concepts', views: 720, color: 'bg-[#8A6A16]' }
  ];
  const maxViews = Math.max(...topResources.map(r => r.views));

  // Generate mock heatmap data (last 4 weeks, 7 days)
  const heatmapData = Array.from({ length: 28 }, () => Math.floor(Math.random() * 5));

  return (
    <div className="space-y-6 animate-[fadeInUp_0.8s_ease-out_forwards]">
      <div className="mb-6">
        <h2 className="dash-serif text-2xl font-bold text-[#22201F] dark:text-[#F6F2EA]">Usage Analytics</h2>
        <p className="mt-1 text-sm text-[#8A7E6F] dark:text-[#A89F91]">Monitor student engagement and platform health in real-time.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {metrics.map((m, i) => (
          <PremiumCard key={i} padding="medium" className="group">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F4E7E5] dark:bg-[#38151A] transition-transform duration-300 group-hover:scale-110">
                {m.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${m.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-[#B23B2E] dark:text-red-400'}`}>
                {m.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {m.change}
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-[#22201F] dark:text-[#F6F2EA]">{m.value}</p>
            <p className="mt-1 text-xs font-semibold text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-wider">{m.label}</p>
          </PremiumCard>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Engagement Chart */}
        <PremiumCard padding="large">
          <PremiumCard.Category>Weekly Engagement</PremiumCard.Category>
          <div className="mt-6 flex h-[200px] items-end justify-between gap-2 sm:gap-4 border-b border-[#22201F]/15 dark:border-[#F6F2EA]/10 pb-2">
            {weeklyData.map((d, i) => {
              const heightPct = (d.hours / maxHours) * 100;
              return (
                <div key={i} className="group relative flex h-full w-full flex-col items-center justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 rounded-lg bg-[#22201F] px-2.5 py-1 text-xs font-bold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 dark:bg-white dark:text-[#22201F]">
                    {d.hours}h
                  </div>
                  <div 
                    className="w-full max-w-[40px] rounded-t-[10px] bg-gradient-to-t from-[#4A0E1B] to-[#7C2532] transition-all duration-500 ease-out hover:opacity-80"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="mt-3 text-xs font-semibold text-[#8A7E6F] dark:text-[#A89F91]">{d.day}</span>
                </div>
              );
            })}
          </div>
        </PremiumCard>

        {/* Top Resources Bar Chart */}
        <PremiumCard padding="large">
          <PremiumCard.Category>Most Accessed Resources</PremiumCard.Category>
          <div className="mt-6 space-y-5">
            {topResources.map((r, i) => {
              const widthPct = (r.views / maxViews) * 100;
              return (
                <div key={i} className="group">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA] truncate pr-4">{r.name}</span>
                    <span className="font-mono text-[#8A7E6F] dark:text-[#A89F91]">{r.views.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAE1D2] dark:bg-[#4A433E]">
                    <div 
                      className={`h-full rounded-full ${r.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </PremiumCard>

        {/* Activity Heatmap */}
        <PremiumCard padding="large" className="lg:col-span-2">
          <PremiumCard.Category>Student Activity Heatmap (Last 28 Days)</PremiumCard.Category>
          <div className="mt-6 flex flex-wrap gap-2 rounded-2xl bg-[#FBF7F0] dark:bg-[#2A2726] p-6 border border-[#22201F]/15 dark:border-[#F6F2EA]/10">
            {heatmapData.map((val, i) => {
              // Color scale based on value (0-4) using purely maroon shades
              const colors = [
                'bg-[#4A0E1B]/10 dark:bg-[#4A0E1B]/20', // 0
                'bg-[#4A0E1B]/30 dark:bg-[#4A0E1B]/40', // 1
                'bg-[#4A0E1B]/50 dark:bg-[#4A0E1B]/60', // 2
                'bg-[#4A0E1B]/75 dark:bg-[#4A0E1B]/80', // 3
                'bg-[#4A0E1B] dark:bg-[#4A0E1B]',       // 4
              ];
              const color = colors[val] || colors[0];
              return (
                <div 
                  key={i} 
                  className={`h-6 w-6 sm:h-8 sm:w-8 rounded-md ${color} transition-colors hover:ring-2 hover:ring-offset-2 hover:ring-[#4A0E1B] hover:ring-offset-[#FBF7F0] dark:hover:ring-offset-[#2A2726] cursor-help`}
                  title={`${val * 12} active sessions`}
                />
              );
            })}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
