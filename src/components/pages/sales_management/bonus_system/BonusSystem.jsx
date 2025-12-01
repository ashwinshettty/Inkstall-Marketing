import React, { useState } from 'react';
import BonusTable from './BonusTable';

const BonusSystem = () => {
    // Generate last 12 months
  const getLast12Months = () => {
    const months = [];
    const date = new Date();
    // Set to first day of the month to avoid month rollover issues
    date.setDate(1);
    
    // Start from 11 months ago to current month
    date.setMonth(date.getMonth() - 11);
    
    for (let i = 0; i < 12; i++) {
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      months.push(`${month} ${year}`);
      date.setMonth(date.getMonth() + 1);
    }
    
    return months;
  };

  const months = getLast12Months();
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentMonthYear = `${currentMonth} ${currentYear}`;
  
  // Set default to current month and year
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Sales Agent Bonus Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-48">
            <label htmlFor="month" className="block text-sm font-medium text-gray-300 mb-1">
              Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Finalize Month
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Bonus Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div>
            <p className="text-gray-400 text-md mb-1">Total Sales</p>
            <h3 className="text-2xl font-bold">9</h3>
          </div>
        </div>

        {/* Eligible Agents Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div>
            <p className="text-gray-400 text-md mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold">₹498,000</h3>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div>
            <p className="text-gray-400 text-md mb-1">Total Bonus</p>
            <h3 className="text-2xl font-bold">₹1,000</h3>
          </div>
        </div>
      </div>
      
      {/* Bonus Table */}
      <div className="mt-8">
        <BonusTable />
      </div>
    </div>
  );
};

export default BonusSystem;
