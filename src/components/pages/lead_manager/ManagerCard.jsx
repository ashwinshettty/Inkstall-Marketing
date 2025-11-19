import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';
import ProgressBar from '../../ui/ProgressBar';

const ManagerCard = () => {
  const counsellors = [
    {
      name: 'Nisha',
      hotLeads: 18,
      followUpsDue: 7,
      progress: 90,
      gradientColors: ['#10B981', '#059669']
    },
    {
      name: 'Priya',
      hotLeads: 11,
      followUpsDue: 5,
      progress: 65,
      gradientColors: ['#3B82F6', '#1D4ED8']
    },
    {
      name: 'Sanjay',
      hotLeads: 9,
      followUpsDue: 6,
      progress: 55,
      gradientColors: ['#F59E0B', '#D97706']
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {counsellors.map((counsellor, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
          {/* Name and Badge Row */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white">{counsellor.name}</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#10A979' }}>
              Hot leads {counsellor.hotLeads}
            </span>
          </div>
          
          {/* Counsellor Load */}
          <p className="text-gray-400 text-sm mb-2">Counsellor Load</p>
          
          {/* Follow-ups */}
          <p className="text-gray-300 text-sm mb-3">Follow-ups due today: {counsellor.followUpsDue}</p>
          
          {/* Progress Bar */}
          <ProgressBar 
            progress={counsellor.progress} 
            gradientColors={counsellor.gradientColors}
          />
        </div>
      ))}
    </div>
  );
};

export default ManagerCard;