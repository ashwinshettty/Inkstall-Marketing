import React from 'react';
import MainCard from '../../ui/MainCard';

const LeadSourcePerformance = () => {
  const leadSources = [
    {
      source: 'Google Ads',
      leads: 145,
      percentage: 78,
      color: 'bg-blue-500',
    },
    {
      source: 'Meta Ads',
      leads: 98,
      percentage: 65,
      color: 'bg-purple-500',
    },
    {
      source: 'Organic',
      leads: 67,
      percentage: 45,
      color: 'bg-green-500',
    },
    {
      source: 'Referrals',
      leads: 43,
      percentage: 32,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <MainCard>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Lead Source Performance</h2>
          <p className="text-slate-400 text-xs mt-1">Breakdown of leads by channel and quality.</p>
        </div>
        <button className="text-xs text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-700 transition-colors">
          View details
        </button>
      </div>
      <div className="space-y-4" style={{ padding: '16px', borderRadius: '8px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" >
          <div className="space-y-4">
            {leadSources.slice(0, 2).map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-4" style={{backgroundColor:"#05091B "}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium" >{item.source}</span>
                  <span className="text-slate-400 text-sm">{item.leads} leads</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-slate-400 text-xs mt-1">{item.percentage}%</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {leadSources.slice(2, 4).map((item, index) => (
              <div key={index + 2} className="bg-slate-800 rounded-lg p-4" style={{backgroundColor:"#05091B "}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium" >{item.source}</span>
                  <span className="text-slate-400 text-sm">{item.leads} leads</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-slate-400 text-xs mt-1">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainCard>
  );
};

export default LeadSourcePerformance;
