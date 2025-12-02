import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserPlus, FaCheckCircle, FaPhoneAlt, FaChartLine } from 'react-icons/fa';
import MainCard from '../../ui/MainCard';
import { useAppContext } from '../../../context/AppContext';
import axios from 'axios';

const SalesMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAppContext();

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const statuses = ['new', 'contacted', 'converted'];
        const promises = statuses.map(status =>
          axios.get(`${import.meta.env.VITE_API_URL}/api/marketing/sales-management/status?status=${status}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
        );

        const results = await Promise.all(promises);
        const [newLeads, contactedLeads, convertedLeads] = results.map(res => res.data.count || 0);

        const totalLeads = newLeads + contactedLeads + convertedLeads;
        const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

        setMetrics([
          {
            title: 'Total Leads',
            value: totalLeads.toLocaleString(),
            change: '',
            isPositive: true,
            icon: <FaUsers />,
            bgColor: 'bg-blue-500',
          },
          {
            title: 'New Leads',
            value: newLeads.toLocaleString(),
            change: '',
            isPositive: true,
            icon: <FaUserPlus />,
            bgColor: 'bg-emerald-500',
          },
          {
            title: 'Contacted',
            value: contactedLeads.toLocaleString(),
            change: '',
            isPositive: false,
            icon: <FaPhoneAlt />,
            bgColor: 'bg-amber-500',
          },
          {
            title: 'Converted',
            value: convertedLeads.toLocaleString(),
            change: '',
            isPositive: true,
            icon: <FaCheckCircle />,
            bgColor: 'bg-green-500',
          },
          {
            title: 'Conversion Rate',
            value: `${conversionRate}%`,
            change: '',
            isPositive: true,
            icon: <FaChartLine />,
            bgColor: 'bg-cyan-500',
          },
        ]);
      } catch (error) {
        console.error('Error fetching sales metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [authToken]);

  if (loading) {
    return <div>Loading Sales Metrics...</div>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-slate-400 text-sm font-medium mb-4">Sales Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <MainCard key={index} className="p-4 hover:border-slate-600 transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                <p className="text-xl font-bold mt-1 text-white">{metric.value}</p>
                {metric.change && (
                  <div className={`flex items-center mt-2 text-xs ${metric.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metric.isPositive ? (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {metric.change}
                  </div>
                )}
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor} bg-opacity-20`}>
                {React.cloneElement(metric.icon, { className: 'text-lg' })}
              </div>
            </div>
          </MainCard>
        ))}
      </div>
    </div>
  );
};

export default SalesMetrics;