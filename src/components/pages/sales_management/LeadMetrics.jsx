import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaCheckCircle, FaPhoneAlt } from 'react-icons/fa';
import MainCard from '../../ui/MainCard';
import axios from 'axios';
import { useAppContext } from '../../../context/AppContext';

const LeadMetrics = () => {
  const { authToken } = useAppContext();
  const [metrics, setMetrics] = useState([
    { title: "Total Leads", count: 0, isPositive: true, icon: <FaUsers className="text-blue-500" /> },
    { title: "New Leads", count: 0, isPositive: true, icon: <FaUserPlus className="text-green-500" /> },
    { title: "Contacted", count: 0, isPositive: true, icon: <FaPhoneAlt className="text-yellow-500" /> },
    { title: "Converted", count: 0, isPositive: true, icon: <FaCheckCircle className="text-purple-500" /> },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) return;
      setLoading(true);

      try {
        // Fetch counts for each status
        const statuses = ['new', 'contacted', 'converted'];
        const requests = statuses.map(status => 
          axios.get(`${import.meta.env.VITE_API_URL}/api/marketing/sales-management/status?status=${status}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        );

        const responses = await Promise.all(requests);
        const [newLeads, contactedLeads, convertedLeads] = responses.map(res => res.data.count || 0);
        const totalLeads = newLeads + contactedLeads + convertedLeads;

        setMetrics([
          { title: "Total Leads", count: totalLeads, isPositive: true, icon: <FaUsers className="text-blue-500" /> },
          { title: "New Leads", count: newLeads, isPositive: true, icon: <FaUserPlus className="text-green-500" /> },
          { title: "Contacted", count: contactedLeads, isPositive: true, icon: <FaPhoneAlt className="text-yellow-500" /> },
          { title: "Converted", count: convertedLeads, isPositive: true, icon: <FaCheckCircle className="text-purple-500" /> },
        ]);

      } catch (error) {
        console.error('Failed to fetch lead metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Lead Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <MainCard key={index} className="p-4 h-24 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </MainCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Lead Metrics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MainCard key={index} className="p-4">
            <div className="flex justify-between items-center h-full">
              <div>
                <p className="text-2xl font-bold text-white">{metric.count}</p>
                <p className="text-sm text-gray-400">{metric.title}</p>
              </div>
              <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${metric.isPositive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)'}` }}>
                {metric.icon}
              </div>
            </div>
          </MainCard>
        ))}
      </div>
    </div>
  );
};

export default LeadMetrics;