import React, { useState } from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';
import ProgressBar from '../../ui/ProgressBar';

const DepartmentSnapshot = () => {
//   const tabs = ['Sales', 'Marketing', 'Support', 'HR'];
  const [activeTab, setActiveTab] = useState('Sales');

  const data = [
    { name: 'Target Achievement', value: 85, progress: 85, gradient: ['#8B5CF6', '#7C3AED'] },
    { name: 'Team Productivity', value: 92, progress: 92, gradient: ['#06B6D4', '#0891B2'] },
    { name: 'Project Completion', value: 78, progress: 78, gradient: ['#10B981', '#059669'] },
    { name: 'Customer Satisfaction', value: 88, progress: 88, gradient: ['#F59E0B', '#D97706'] },
  ];

  return (
    <MainCard className="h-80">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Department Snapshot</h2>
          <p className="text-slate-400 text-xs mt-1">Team performance metrics</p>
        </div>
      </div>
      <InnerCard className="h-full">
        <div className="h-full flex flex-col justify-center px-4 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm font-medium">{item.name}</span>
                <span className="text-white text-sm font-bold">{item.value}%</span>
              </div>
              <ProgressBar progress={item.progress} gradientColors={item.gradient} />
            </div>
          ))}
        </div>
      </InnerCard>
    </MainCard>
  );
};

export default DepartmentSnapshot;