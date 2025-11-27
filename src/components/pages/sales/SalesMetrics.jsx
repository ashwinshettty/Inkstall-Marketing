import React from 'react';
import { FaUsers, FaUserPlus, FaCheckCircle, FaPhoneAlt, FaChartLine } from 'react-icons/fa';
import MainCard from '../../ui/MainCard';

const SalesMetrics = () => {
  // Sample data - replace with actual API data
  const metrics = [
    {
      title: 'Total Leads',
      value: '1,234',
      change: '+12.5%',
      isPositive: true,
      icon: <FaUsers />,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-400'
    },
    {
      title: 'New Leads',
      value: '156',
      change: '+5.2%',
      isPositive: true,
      icon: <FaUserPlus />,
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Confirmed',
      value: '89',
      change: '+3.1%',
      isPositive: true,
      icon: <FaCheckCircle />,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-400'
    },
    {
      title: 'Contacted',
      value: '342',
      change: '-2.4%',
      isPositive: false,
      icon: <FaPhoneAlt />,
      bgColor: 'bg-amber-500',
      textColor: 'text-amber-400'
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+1.7%',
      isPositive: true,
      icon: <FaChartLine />,
      bgColor: 'bg-cyan-500',
      textColor: 'text-cyan-400'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-slate-400 text-sm font-medium mb-4">Sales Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <MainCard key={index} className="p-4 hover:border-slate-600 transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                <p className="text-xl font-bold mt-1 text-white">{metric.value}</p>
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