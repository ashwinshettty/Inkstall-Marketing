import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const ConsiderationCard = () => {
  const consideration = '8.3K';
  const percentageChange = 6;
  const progress = 60; // Example progress
  const gradient = ['#34D399', '#10B981'];

  return (
    <MainCard title="Consideration" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{consideration}</p>
          <div className="bg-green-500 bg-opacity-20 text-white text-xs font-semibold px-2 py-1 rounded-full">
            +{percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default ConsiderationCard;