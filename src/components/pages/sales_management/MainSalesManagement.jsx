import React, { useState } from "react";
import LeadAssignment from "./LeadAssignment";
import SalesFunnel from "./SalesFunnel";
import SalesAnalytics from "./SalesAnalytics";
import PerformanceCharts from "./PerformanceCharts";
import BonusSystem from "./BonusSystem";
import PerformanceMetrics from "./PerformanceMetrics";

const MainSalesManagement = () => {
  const [value, setValue] = useState(0);

  const tabs = [
    "Lead Assignment",
    "Sales Funnel",
    "Sales Analytics",
    "Performance Charts",
    "Bonus System",
    "Performance Metrics",
  ];

  return (
    <div className="w-full p-4 text-white">

      {/* Tabs Header */}
      <div className="border-b border-slate-700 flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setValue(index)}
            className={`px-4 py-2 text-sm transition ${
              value === index
                ? "border-b-2 border-blue-500 text-blue-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="mt-4">
        {value === 0 && <LeadAssignment />}
        {value === 1 && <SalesFunnel />}
        {value === 2 && <SalesAnalytics />}
        {value === 3 && <PerformanceCharts />}
        {value === 4 && <BonusSystem />}
        {value === 5 && <PerformanceMetrics />}
      </div>
    </div>
  );
};

export default MainSalesManagement;
