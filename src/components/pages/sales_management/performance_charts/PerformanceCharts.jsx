import React, { useState } from "react";
import RevenueByProgram from "./RevenueByProgram";
import PerformanceTrends from "./PerformanceTrends";
import ConversionFunnel from "./ConversionFunnel";
import AgentPerformance from "./AgentPerformance";
import LeadSources from "./LeadSources";

const PerformanceCharts = () => {
  const [timeRange, setTimeRange] = useState("All Time");
  const [selectedCounsellor, setSelectedCounsellor] = useState("All Counsellors");
  const [activeChart, setActiveChart] = useState("Revenue By Program");
  
  const timeRanges = ["Last Week", "Last Month", "Last Quarter", "Last Year", "All Time"];
  const counsellors = ["All Counsellors", "Counsellor 1", "Counsellor 2", "Counsellor 3"];
  const chartTypes = ["Revenue By Program", "Performance Trends", "Conversion Funnel", "Agent Performance", "Lead Sources"];

  // Chart component mapping
  const chartComponents = {
    "Revenue By Program": <RevenueByProgram />,
    "Performance Trends": <PerformanceTrends />,
    "Conversion Funnel": <ConversionFunnel />,
    "Agent Performance": <AgentPerformance />,
    "Lead Sources": <LeadSources />
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Performance Charts</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Counsellor Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="counsellor" className="block text-sm font-medium text-gray-300 mb-1">
              Counsellor
            </label>
            <select
              id="counsellor"
              value={selectedCounsellor}
              onChange={(e) => setSelectedCounsellor(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {counsellors.map((counsellor) => (
                <option key={counsellor} value={counsellor}>
                  {counsellor}
                </option>
              ))}
            </select>
          </div>

          {/* Time Period Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-300 mb-1">
              Time Period
            </label>
            <select
              id="timePeriod"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Last Week">Last Week</option>
              <option value="Last Month">Last Month</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Last Year">Last Year</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart Type Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chartTypes.map((chartType) => (
          <button
            key={chartType}
            onClick={() => setActiveChart(chartType)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === chartType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {chartType}
          </button>
        ))}
      </div>

      {/* Chart Content */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {chartComponents[activeChart]}
      </div>
    </div>
  );
};

export default PerformanceCharts;
