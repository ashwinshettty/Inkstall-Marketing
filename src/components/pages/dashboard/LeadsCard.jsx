import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const LeadsCard = () => {
  const leads = 432;
  const percentageChange = 18;
  const progress = 60; // Example progress
  const gradient = ['#FBBF24', '#34D399', '#3B82F6'];

  return (
    <MainCard title="Leads (This Month)" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{leads}</p>
          <div className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
            +{percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default LeadsCard;