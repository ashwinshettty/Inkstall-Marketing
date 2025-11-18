import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const AdSpendCard = () => {
  const adSpend = '₹1,84,000';
  const percentageChange = 7;
  const progress = 70; // Example progress
  const gradient = ['#FBBF24', '#34D399'];

  return (
    <MainCard title="Ad Spend (This Month)" className="h-36">
      <div className="flex flex-col justify-end h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-3xl font-bold">{adSpend}</p>
          <div className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
            +{percentageChange}%
          </div>
        </div>
        <ProgressBar progress={progress} gradientColors={gradient} />
      </div>
    </MainCard>
  );
};

export default AdSpendCard;