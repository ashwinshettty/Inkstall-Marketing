import React from 'react';
import CampaignPerformance from './CampaignPerformance';
import BoardwiseAnalytics from './BoardwiseAnalytics';
import LocationbasedPerformance from './LocationbasedPerformance';
import Suggestion from './Suggestions';

const PerformanceAnalytics = () => {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-white mb-2">Performance Analytics</h2>
      <p className="text-xs text-gray-400 mb-6">Deep dive into campaigns, boards, locations and employee performance.</p>
      
      <div className="grid grid-cols-2 gap-4" >
        <CampaignPerformance />
        <BoardwiseAnalytics />
        <LocationbasedPerformance />
        <Suggestion />
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
