import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const AvgCPLCard = () => {
  const avgCPL = '₹426';
  const percentageChange = -9;
  const progress = 40; // Example progress
  const gradient = ['#FBBF24', '#34D399'];

  return (
    <MainCard title="Avg. CPL" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{avgCPL}</p>
          <div className="bg-red-500 bg-opacity-20 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default AvgCPLCard;
