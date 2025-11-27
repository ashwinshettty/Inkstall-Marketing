import React from "react";
import MainCard from "../../ui/MainCard";

const LeadMetrics = () => {
  // Sample data for the lead metrics
  const metrics = [
    { 
      title: "Total Leads", 
      count: "1,234", 
      change: "+12%", 
      isPositive: true,
    },
    { 
      title: "New Leads", 
      count: "156", 
      change: "+8%", 
      isPositive: true,
    },
    { 
      title: "In Progress", 
      count: "89", 
      change: "-3%", 
      isPositive: false,
    },
    { 
      title: "Converted", 
      count: "45", 
      change: "+5%", 
      isPositive: true,
    },
    { 
      title: "Lost Leads", 
      count: "23", 
      change: "-2%", 
      isPositive: false,
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Lead Metrics</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <MainCard key={index} title={metric.title} className="p-4">
            <div className="flex justify-between items-center h-full">
              <div>
                <p className="text-2xl font-bold text-white">{metric.count}</p>
                <p className={`text-sm mt-1 ${metric.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change} from last week
                </p>
              </div>
              <span className="text-2xl">{metric.icon}</span>
            </div>
          </MainCard>
        ))}
      </div>
    </div>
  );
};

export default LeadMetrics;