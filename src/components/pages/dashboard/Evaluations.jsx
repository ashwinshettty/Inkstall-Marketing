import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const EvaluationsCard = () => {
  const evaluations = '1.2K';
  const percentageChange = 4;
  const progress = 50; // Example progress
  const gradient = ['#F59E0B', '#EF4444'];

  return (
    <MainCard title="Evaluations" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{evaluations}</p>
          <div className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
            +{percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default EvaluationsCard;