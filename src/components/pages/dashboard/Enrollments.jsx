import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const EnrollmentsCard = () => {
  const enrollments = '384';
  const percentageChange = 9;
  const progress = 45; // Example progress
  const gradient = ['#A78BFA', '#EC4899'];

  return (
    <MainCard title="Enrollments" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{enrollments}</p>
          <div className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
            +{percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default EnrollmentsCard;