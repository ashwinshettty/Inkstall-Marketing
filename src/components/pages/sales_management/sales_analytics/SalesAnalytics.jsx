import React, { useState, useEffect } from "react";
import axios from "axios";
import LastWeek from "./LastWeek";
import LastMonth from "./LastMonth";
import LastQuarter from "./LastQuarter";
import LastYear from "./LastYear";
import AllTime from "./AllTime";

const SalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState("All Time");
  const [selectedCounsellor, setSelectedCounsellor] = useState("all");
  const [leads, setLeads] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const timeRanges = ["Last Week", "Last Month", "Last Quarter", "Last Year", "All Time"];

  // Fetch leads and extract counsellors
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await axios.get(`${apiUrl}/api/marketing/sales-management/`);
        
        if (response.data.success) {
          const fetchedLeads = response.data.leads || [];
          setLeads(fetchedLeads);
          
          // Extract unique counsellors
          const uniqueCounsellors = new Map();
          uniqueCounsellors.set("all", { id: "all", name: "All Counsellors" });
          
          fetchedLeads.forEach(lead => {
            if (lead.assignedTo && typeof lead.assignedTo === 'object') {
              const userId = lead.assignedTo._id?.toString() || lead.assignedTo.userId?.toString();
              const userName = lead.assignedTo.studentName || lead.assignedTo.name || 'Unknown';
              
              if (userId && !uniqueCounsellors.has(userId)) {
                uniqueCounsellors.set(userId, { id: userId, name: userName });
              }
            }
          });
          
          setCounsellors(Array.from(uniqueCounsellors.values()));
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filter leads based on selected counsellor
  const filteredLeads = selectedCounsellor === "all" 
    ? leads 
    : leads.filter(lead => {
        const assignedToId = lead.assignedTo?._id?.toString() || lead.assignedTo?.userId?.toString();
        return assignedToId === selectedCounsellor;
      });

  // Helper function to normalize dates to the start of day in local timezone
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Filter leads based on time period using the most recent status change
  const getLeadsForTimePeriod = (timePeriod) => {
    const today = normalizeDate(new Date());
    const startDate = new Date(today);
    const endDate = new Date(today);
    
    // Set the date range based on the selected time period
    switch (timePeriod) {
      case "Last Week":
        // Last 7 days, not including today
        startDate.setDate(today.getDate() - 7);
        endDate.setDate(today.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Last Month":
        // Previous calendar month (e.g., if today is Dec 1, this is Nov 1 - Nov 30)
        startDate.setMonth(today.getMonth() - 1, 1);
        endDate.setDate(0); // Last day of previous month
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Last Quarter":
        // Previous full quarter (e.g., if today is in Q4 2023, this is Q3 2023)
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        const startMonth = (currentQuarter === 0 ? 9 : (currentQuarter - 1) * 3); // 9 for Q4, 0 for Q1, etc.
        const startYear = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
        
        startDate.setFullYear(startYear);
        startDate.setMonth(startMonth, 1);
        
        endDate.setFullYear(startYear);
        endDate.setMonth(startMonth + 2, 0); // Last day of the quarter
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Last Year":
        // Previous calendar year (e.g., if today is 2023, this is 2022)
        startDate.setFullYear(today.getFullYear() - 1, 0, 1); // Jan 1 of last year
        endDate.setFullYear(today.getFullYear() - 1, 11, 31); // Dec 31 of last year
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return filteredLeads; // For 'All Time', return all filtered leads
    }

    return filteredLeads.filter(lead => {
      // Get the most recent status change date
      let lastActivityDate;
      if (lead.statusHistory && lead.statusHistory.length > 0) {
        // Sort statusHistory by date in descending order and get the most recent
        const sortedHistory = [...lead.statusHistory].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        lastActivityDate = new Date(sortedHistory[0].date);
      } else {
        // Fallback to createdAt if no status history exists
        lastActivityDate = new Date(lead.createdAt || 0);
      }
      
      // Normalize the activity date to the start of the day for comparison
      lastActivityDate = normalizeDate(lastActivityDate);
      
      // Check if the last activity is within the selected time period
      return lastActivityDate >= startDate && lastActivityDate <= endDate;
    });
  };

  // Component mapping based on time range with filtered leads
  const timeRangeComponents = {
    "Last Week": <LastWeek leads={getLeadsForTimePeriod("Last Week")} />,
    "Last Month": <LastMonth leads={getLeadsForTimePeriod("Last Month")} />,
    "Last Quarter": <LastQuarter leads={getLeadsForTimePeriod("Last Quarter")} />,
    "Last Year": <LastYear leads={getLeadsForTimePeriod("Last Year")} />,
    "All Time": <AllTime leads={filteredLeads} />
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Sales Analytics</h1>
        
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
                <option key={counsellor.id} value={counsellor.id}>
                  {counsellor.name}
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

      {/* Time Range Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Analytics Content */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {timeRangeComponents[timeRange]}
      </div>
    </div>
  );
};

export default SalesAnalytics;
