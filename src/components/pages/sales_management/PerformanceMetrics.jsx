import React, { useState } from "react";

const PerformanceMetrics = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState("All Counsellors");
  const [selectedPeriod, setSelectedPeriod] = useState("All Time");
  const counsellors = ["All Counsellors", "Counsellor 1", "Counsellor 2", "Counsellor 3"];
  const leads = [
    {
      title: "Total Leads",
      value: "967",
      description: "Total leads in database"
    },
    {
      title: "New Leads Today",
      value: "2",
      description: "Added in last 24 hours"
    },
    {
      title: "Qualified Leads",
      value: "5",
      description: "Students with qualified status"
    },
    {
      title: "Contacted Leads",
      value: "86",
      description: "Students with contacted status"
    },
    {
      title: "Conversion Rate",
      value: "9.6%",
      description: "Total Students / Converted Students"
    }
  ];
  const activities = [
    {
      title: "All Activities",
      value: "1097"
    },
    {
      title: "Note",
      value: "303"
    },
    {
      title: "Call",
      value: "759"
    },
    {
      title: "Email",
      value: "2"
    },
    {
      title: "Meeting",
      value: "9"
    },
    {
      title: "Tour",
      value: "2"
    },
    {
      title: "Demo",
      value: "5"
    },
    {
      title: "Interview",
      value: "1"
    },
    {
      title: "Document",
      value: "0"
    },
    {
      title: "Payment",
      value: "0"
    },
    {
      title: "Reminder",
      value: "2"
    },
    {
      title: "Task",
      value: "2"
    }
  ];

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Lead Metrics</h1>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-12 gap-6">
        {leads.map((lead, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
              <div>
                <p className="text-xl font-bold text-white mb-2">{lead.title}</p>
                <p className="text-3xl font-semibold text-blue-400">{lead.value}</p>
                <p className="text-sm text-gray-400">{lead.description}</p>
              </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Activity Metrics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-800 rounded-md p-1.5 border border-gray-700">
            {['All Time', 'Today', 'Yesterday'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  period === selectedPeriod 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="date"
              className="block w-full px-5 py-2 border border-gray-700 rounded-md bg-gray-800 text-white text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Calendar"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-12 gap-6">
        {activities.map((activity, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
              <div>
                <p className="text-xl font-bold text-white mb-2">{activity.title}</p>
                <p className="text-3xl font-semibold text-blue-400">{activity.value}</p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
