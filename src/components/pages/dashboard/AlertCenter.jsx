import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const AlertCenter = () => {
  const alerts = [
    {
      tag: 'BUDGET OVERSHOOT',
      color: 'bg-red-500',
      description: 'Meta Ads - IBDP Math pacing 19% above budget. Review daily caps.',
      time: '10m ago',
    },
    {
      tag: 'LEAD SPIKE',
      color: 'bg-yellow-500',
      description: 'Website organic enquiries up 27% vs yesterday. Assign counsellors.',
      time: '35m ago',
    },
    {
      tag: 'CREATIVE EXPIRY',
      color: 'bg-blue-500',
      description: 'IGCSE Science Carousel 01 expires in 2 days. Upload refreshed set.',
      time: '1h ago',
    },
  ];

  return (
    <MainCard>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Alert Centre</h2>
          <p className="text-slate-400 text-xs mt-1">Real-time monitoring on spend, leads and creatives.</p>
        </div>
        <button className="text-xs text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-700 transition-colors">
          View all
        </button>
      </div>
      <InnerCard className="h-full">
        <div className="space-y-4 p-4">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start p-3 bg-slate-800 rounded-lg">
              <div className="flex-shrink-0 mr-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${alert.color}`}>
                  {alert.tag}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-200">{alert.description}</p>
                <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </InnerCard>
    </MainCard>
  );
};

export default AlertCenter;
