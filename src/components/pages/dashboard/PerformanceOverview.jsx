import React, { useState } from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const PerformanceOverview = () => {
  const tabs = ['Today', '7 days', '30 days', 'Custom'];
  const [activeTab, setActiveTab] = useState('Today');

  const categories = [
    { name: 'Spend', color: '#F59E0B' },
    { name: 'Leads', color: '#10B981' },
    { name: 'Conversions', color: '#3B82F6' },
  ];

  const data = [
    { day: 'D1', spend: 30, leads: 25, conversions: 20 },
    { day: 'D2', spend: 45, leads: 35, conversions: 30 },
    { day: 'D3', spend: 70, leads: 55, conversions: 45 },
    { day: 'D4', spend: 75, leads: 58, conversions: 48 },
    { day: 'D5', spend: 80, leads: 62, conversions: 50 },
    { day: 'D6', spend: 85, leads: 65, conversions: 52 },
    { day: 'D7', spend: 90, leads: 68, conversions: 55 },
  ];

  const maxValue = 100;

  return (
    <MainCard className="h-80">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Performance Overview</h2>
          <div className="flex items-center gap-4 mt-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                <span className="text-slate-400 text-xs">{category.name}</span>
              </div>
            ))}
          </div>
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
      <InnerCard className="h-full overflow-hidden">
        <div className="h-full flex flex-col justify-center px-4">
          <div className="flex items-end justify-center gap-2 h-44">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex flex-col-reverse w-16 border-2 border-slate-700 rounded-md overflow-hidden">
                  <div 
                    className="w-full transition-all duration-300"
                    style={{ 
                      height: `${(item.conversions / maxValue) * 140}px`,
                      backgroundColor: '#3B82F6'
                    }}
                  ></div>
                  <div 
                    className="w-full transition-all duration-300"
                    style={{ 
                      height: `${(item.leads / maxValue) * 140}px`,
                      backgroundColor: '#10B981'
                    }}
                  ></div>
                  <div 
                    className="w-full transition-all duration-300"
                    style={{ 
                      height: `${(item.spend / maxValue) * 140}px`,
                      backgroundColor: '#F59E0B'
                    }}
                  ></div>
                </div>
                <span className="text-slate-400 text-xs mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </InnerCard>
    </MainCard>
  );
};

export default PerformanceOverview;