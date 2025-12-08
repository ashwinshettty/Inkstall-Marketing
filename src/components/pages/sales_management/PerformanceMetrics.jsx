import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from '../../../context/AppContext';

const PerformanceMetrics = () => {
  const { authToken } = useAppContext();
  const [selectedCounsellor, setSelectedCounsellor] = useState("All Counsellors");
  const [selectedPeriod, setSelectedPeriod] = useState("All Time");
  const [leadCounts, setLeadCounts] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0
  });
  const [loading, setLoading] = useState(true);
  const [counsellors, setCounsellors] = useState([]);
  const [counsellorsLoading, setCounsellorsLoading] = useState(true);

  // Fetch counsellors from API
  useEffect(() => {
    const fetchCounsellors = async () => {
      if (!authToken) return;
      setCounsellorsLoading(true);

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/marketing/users`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        if (response.data.success) {
          setCounsellors(response.data.users || []);
        }
      } catch (error) {
        console.error('Error fetching counsellors:', error);
      } finally {
        setCounsellorsLoading(false);
      }
    };

    fetchCounsellors();
  }, [authToken]);

  // Fetch all lead counts from API
  useEffect(() => {
    const fetchLeadCounts = async () => {
      if (!authToken) return;
      setLoading(true);

      try {
        // Fetch counts for each status
        const statuses = ['new', 'contacted', 'qualified', 'converted'];
        const requests = statuses.map(status => 
          axios.get(`${import.meta.env.VITE_API_URL}/api/marketing/sales-management/status?status=${status}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        );

        const responses = await Promise.all(requests);
        const [newCount, contactedCount, qualifiedCount, convertedCount] = responses.map(res => res.data.count || 0);
        const totalCount = newCount + contactedCount + qualifiedCount + convertedCount;

        setLeadCounts({
          total: totalCount,
          new: newCount,
          contacted: contactedCount,
          qualified: qualifiedCount,
          converted: convertedCount
        });

      } catch (error) {
        console.error('Error fetching lead counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadCounts();
  }, [authToken]);

  // Calculate conversion rate
  const conversionRate = leadCounts.converted > 0 
    ? ((leadCounts.total / leadCounts.converted)*100).toFixed(1) 
    : 0;

  const leads = [
    {
      title: "Total Leads",
      value: loading ? "..." : leadCounts.total.toString(),
      description: "Total leads in database"
    },
    {
      title: "New Leads",
      value: loading ? "..." : leadCounts.new.toString(),
      description: "Leads with new status"
    },
    {
      title: "Qualified Leads",
      value: loading ? "..." : leadCounts.qualified.toString(),
      description: "Students with qualified status"
    },
    {
      title: "Contacted Leads",
      value: loading ? "..." : leadCounts.contacted.toString(),
      description: "Students with contacted status"
    },
    {
      title: "Conversion Rate",
      value: loading ? "..." : `${conversionRate}%`,
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
            disabled={counsellorsLoading}
          >
            <option value="All Counsellors">All Counsellors</option>
            {counsellors.map((counsellor) => (
              <option key={counsellor._id} value={counsellor._id}>
                {counsellor.name}
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
