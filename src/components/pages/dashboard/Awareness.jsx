import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const AwarenessCard = () => {
  const awareness = '62.5K';
  const percentageChange = 11;
  const progress = 75; // Example progress
  const gradient = ['#60A5FA', '#3B82F6'];

  return (
    <MainCard title="Awareness" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{awareness}</p>
          <div className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
            +{percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default AwarenessCard;
