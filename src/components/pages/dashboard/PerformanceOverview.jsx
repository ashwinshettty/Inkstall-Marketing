import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const PerformanceOverview = () => {
  const tabs = ['Today', '7 days', '30 days', 'Custom'];
  const [activeTab, setActiveTab] = useState('Today');

  const categories = [
    { name: 'Spend', color: '#CC9D25' },
    { name: 'Leads', color: '#1F6458' },
    { name: 'Conversions', color: '#3B82F6' },
  ];

  const data = [
    { day: 'D1', spend: 30, leads: 25, conversions: 20 },
    { day: 'D2', spend: 45, leads: 35, conversions: 30 },
    { day: 'D3', spend: 70, leads: 55, conversions: 50 },
    { day: 'D4', spend: 75, leads: 58, conversions: 50 },
    { day: 'D5', spend: 80, leads: 62, conversions: 50 },
    { day: 'D6', spend: 85, leads: 65, conversions: 50 },
    { day: 'D7', spend: 90, leads: 68, conversions: 50 },
  ];

  return (
    <MainCard>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Performance Overview</h2>
          <p className="text-xs text-gray-400 mt-1">Impressions → Clicks → Leads → Conversions</p>
        </div>
        <div className="flex items-center bg-slate-800 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${ 
                activeTab === tab 
                  ? 'bg-slate-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <InnerCard>
        <div className="flex items-center gap-4 mb-4">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }}></div>
              <span className="text-xs text-white">{category.name}</span>
            </div>
          ))}
        </div>
        
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <Bar dataKey="conversions" stackId="a" fill="#1D577A" radius={[0, 0, 0, 0]} />
              <Bar dataKey="leads" stackId="a" fill="#1D6156" radius={[0, 0, 0, 0]} />
              <Bar dataKey="spend" stackId="a" fill="#B68E27" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Day Labels */}
        <div className="flex justify-around px-2 mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-sm text-gray-400 font-medium">
              {item.day}
            </div>
          ))}
        </div>
      </InnerCard>
    </MainCard>
  );
};

export default PerformanceOverview;