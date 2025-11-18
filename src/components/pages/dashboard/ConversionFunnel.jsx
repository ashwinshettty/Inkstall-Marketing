import React from 'react';
import MainCard from '../../ui/MainCard';

const ConversionFunnel = () => {
  const funnelStages = [
    {
      stage: 'Awareness',
      count: 1250,
      percentage: 100,
      color: 'bg-blue-500',
    },
    {
      stage: 'Interest',
      count: 850,
      percentage: 68,
      color: 'bg-purple-500',
    },
    {
      stage: 'Consideration',
      count: 520,
      percentage: 42,
      color: 'bg-green-500',
    },
    {
      stage: 'Evaluation',
      count: 280,
      percentage: 22,
      color: 'bg-yellow-500',
    },
    {
      stage: 'Enrollment',
      count: 145,
      percentage: 12,
      color: 'bg-orange-500',
    },
  ];

  return (
    <MainCard>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Conversion Funnel</h2>
          <p className="text-slate-400 text-xs mt-1">Student journey from awareness to enrollment.</p>
        </div>
        <button className="text-xs text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-700 transition-colors">
          Analyze
        </button>
      </div>
      <div className="space-y-3">
        {funnelStages.map((stage, index) => (
          <div key={index} className="relative bg-slate-800 rounded-lg p-4" style={{backgroundColor:"#05091B "}}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{stage.stage}</span>
              <span className="text-slate-400 text-sm">{stage.count} students</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${stage.color}`}
                style={{ width: `${stage.percentage}%` }}
              ></div>
            </div>
            <span className="text-slate-400 text-xs mt-1">{stage.percentage}%</span>
          </div>
        ))}
      </div>
    </MainCard>
  );
};

export default ConversionFunnel;
