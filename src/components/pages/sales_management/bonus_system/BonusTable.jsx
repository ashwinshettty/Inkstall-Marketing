import React, { useState } from 'react';

const BonusTable = () => {
  const [showDetails, setShowDetails] = useState(false);
  const bonusData = [
    { 
      id: 1, 
      name: 'Ashwin Shetty', 
      target: 12, 
      sales: 2, 
      revenue: 84000, 
      standardBonus: 0, 
      volumeBonus: 0, 
      highValueBonus: 0, 
      installmentBonus: 200, 
      earlyDepartureDeduction: 0, 
      totalBonus: 200, 
    },
    { 
      id: 2, 
      name: 'Ashwin Shetty', 
      target: 12, 
      sales: 2, 
      revenue: 84000, 
      standardBonus: 0, 
      volumeBonus: 0, 
      highValueBonus: 0, 
      installmentBonus: 200, 
      earlyDepartureDeduction: 0, 
      totalBonus: 200, 
    },
  ];

  // Calculate totals
  const calculateTotals = () => {
    return bonusData.reduce((acc, curr) => {
      return {
        sales: acc.sales + curr.sales,
        revenue: acc.revenue + curr.revenue,
        standardBonus: acc.standardBonus + curr.standardBonus,
        volumeBonus: acc.volumeBonus + curr.volumeBonus,
        highValueBonus: acc.highValueBonus + curr.highValueBonus,
        installmentBonus: acc.installmentBonus + curr.installmentBonus,
        earlyDepartureDeduction: acc.earlyDepartureDeduction + curr.earlyDepartureDeduction,
        totalBonus: acc.totalBonus + curr.totalBonus,
      };
    }, {
      sales: 0,
      revenue: 0,
      standardBonus: 0,
      volumeBonus: 0,
      highValueBonus: 0,
      installmentBonus: 0,
      earlyDepartureDeduction: 0,
      totalBonus: 0,
    });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Name</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Target</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Sales</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Revenue</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Standard Bonus</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Volume Bonus</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">High-Value Bonus</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Installment Bonus</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Early Departure Deduction</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Total Bonus</th>
              <th scope="col" className="px-3 py-3 text-left text-md font-bold text-white tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {bonusData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-700/50">
                <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">{row.name}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">{row.target}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">{row.sales}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">₹{row.revenue}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">₹{row.standardBonus}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">₹{row.volumeBonus}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">₹{row.highValueBonus}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">₹{row.installmentBonus}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">₹{row.earlyDepartureDeduction}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{row.totalBonus}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-700">
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">Total</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">{totals.target}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">{totals.sales}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.revenue.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.standardBonus.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.volumeBonus.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.highValueBonus.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.installmentBonus.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.earlyDepartureDeduction.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-white">₹{totals.totalBonus.toLocaleString()}</td>
              <td className="px-3 py-3 whitespace-nowrap text-sm font-medium"></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>

      {/* Toggle Button for Bonus Details */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
        <p className="text-lg text-white mb-3 sm:mb-0">
          Bonus Calculation Notes
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Bonus Details Section */}
      {showDetails && (
        <div className="mt-3 bg-gray-800 px-4 pb-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Standard Bonus</h3>
              <p className="text-white">What it is: A fixed amount paid for each qualified sale that meets the minimum installment requirement.</p>
              <p className="text-white">Example: If you close a sale with a student who pays the minimum installment of ₹30,000, you earn a standard bonus of ₹1,000.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Volume Bonus</h3>
              <p className="text-white">What it is: Replaces the Standard Bonus when you achieve a higher number of sales in a month.</p>
              <p className="text-white">Example: If you make 10 or more qualified sales in a month, instead of getting ₹1,000 per sale, you'll get ₹1,500 per sale for all sales that month.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">High-Value Bonus</h3>
              <p className="text-white">What it is: An additional bonus for closing deals above a certain value when all installments are received.</p>
              <p className="text-white">Example: If you close a deal worth ₹200,000 or more and all installments are paid, you earn an extra ₹3,000 on top of your other bonuses.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Installment Collection Bonus</h3>
              <p className="text-white">What it is: A bonus for each large installment collected on time or shortly after the deadline.</p>
              <p className="text-white">Example: If a student pays an installment of ₹20,000 either on time or within 30 days after the due date, you earn ₹200.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Early Departure Deduction</h3>
              <p className="text-white">What it is: A deduction applied when a student leaves the program early.</p>
              <p className="text-white">Example: If a student you enrolled leaves before completing 40% of their program, ₹1,000 will be deducted from your next bonus payment.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-400">Total Bonus Calculation</h3>
              <p className="text-white">Formula: (Standard Bonus OR Volume Bonus) + High-Value Bonus + Installment Collection Bonus - Early Departure Deduction</p>
              <p className="text-white">Example: If you make 6 standard sales (₹1,500 × 6 = ₹9,000), have 2 high-value sales (₹3,000 × 2 = ₹6,000), collect 3 eligible installments (₹200 × 3 = ₹600), and have 1 early departure (₹1,000), your total bonus would be ₹14,600.</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default BonusTable;