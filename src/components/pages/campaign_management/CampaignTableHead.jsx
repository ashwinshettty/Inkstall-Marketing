import React from 'react';
import InnerCard from '../../ui/InnerCard';

const CampaignTableHead = () => {
  const stats = [
    {
      title: "Active Campaigns",
      value: "7",
      change: "+2 vs last week",
      changeType: "positive"
    },
    {
      title: "Monthly Spend",
      value: "₹1,84,000",
      change: "+7%",
      changeType: "positive"
    },
    {
      title: "Average CPL",
      value: "₹412",
      change: "-6%",
      changeType: "negative"
    },
    {
      title: "Overall ROI",
      value: "3.6x",
      change: "+0.3x",
      changeType: "positive"
    }
  ];

  return (
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#0A0F1F] rounded-lg p-4 text-center space-y-2">
            <h3 className="text-xs text-gray-400">{stat.title}</h3>
            <p className="text-lg font-semibold text-white">{stat.value}</p>
            <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>
  );
};

export default CampaignTableHead;