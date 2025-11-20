import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const BoardwiseAnalytics = () => {
  const boardData = [
    { name: 'IGCSE', avgCPL: '₹380', conversionRate: '19%' },
    { name: 'ICSE', avgCPL: '₹320', conversionRate: '22%' },
    { name: 'CBSE', avgCPL: '₹295', conversionRate: '17%' },
    { name: 'IBDP', avgCPL: '₹540', conversionRate: '24%' }
  ];

  return (
    <MainCard>
      <div className="p-2">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Board-wise Analytics</h2>
            <p className="text-xs text-gray-400">Average CPL & conversions by board.</p>
          </div>
        </div>

        {/* Board Cards */}
        <div className="space-y-3">
          {boardData.map((board, index) => (
            <InnerCard key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{board.name}</h3>
                  <p className="text-xs text-gray-400">Avg CPL: {board.avgCPL}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Conversion rate</p>
                  <p className="text-2xl font-bold text-[#4ADE80]">{board.conversionRate}</p>
                </div>
              </div>
            </InnerCard>
          ))}
        </div>
      </div>
    </MainCard>
  );
};

export default BoardwiseAnalytics;
