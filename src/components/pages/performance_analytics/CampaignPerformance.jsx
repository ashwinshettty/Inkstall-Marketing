import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const CampaignPerformance = () => {
  const [timePeriod, setTimePeriod] = useState('Last 30 days');

  // Sample data for the stacked bar chart
  const weekData = [
    { week: 'WK1', spend: 45, leads: 60, cpl: 65 },
    { week: 'WK2', spend: 50, leads: 65, cpl: 75 },
    { week: 'WK3', spend: 35, leads: 40, cpl: 50 },
    { week: 'WK4', spend: 55, leads: 50, cpl: 75 }
  ];

  return (
    <MainCard>
      <div className="p-2">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Campaign Performance</h2>
            <p className="text-xs text-gray-400">Spend vs leads vs CPL trend.</p>
          </div>
          <select 
            className="bg-[#05091B] border border-white rounded-full px-4 py-2 text-white text-sm cursor-pointer outline-none hover:border-[#2d3548] focus:border-[#4a5568] transition-colors"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>Custom</option>
          </select>
        </div>

        <InnerCard>
          {/* Legend */}
          <div className="flex gap-5 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]"></span>
              <span className="text-xs text-white">Spend</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]"></span>
              <span className="text-xs text-white">Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]"></span>
              <span className="text-xs text-white">CPL</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weekData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <Bar dataKey="cpl" stackId="a" fill="#1F6458" radius={[0, 0, 0, 0]} />
                <Bar dataKey="leads" stackId="a" fill="#CC9D25" radius={[0, 0, 0, 0]} />
                <Bar dataKey="spend" stackId="a" fill="#CC9D25" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Week Labels */}
          <div className="flex justify-around px-8 mt-2">
            {weekData.map((data, index) => (
              <div key={index} className="text-sm text-gray-400 font-medium">
                {data.week}
              </div>
            ))}
          </div>
        </InnerCard>
      </div>
    </MainCard>
  );
};

export default CampaignPerformance;
