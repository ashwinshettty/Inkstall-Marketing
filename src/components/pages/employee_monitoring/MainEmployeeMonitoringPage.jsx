import React from 'react';
import ProgressBar from '../../ui/ProgressBar';

const EmployeeMonitoring = () => {
  const employees = [
    {
      name: 'Nisha',
      role: 'Counsellor',
      score: 'A',
      stats: {
        calls: 46,
        leads: 28,
        conversion: '32%',
        response: '5 min',
      },
      monthlyTarget: 85,
      progressGradient: ['#22c55e', '#facc15', '#ef4444'],
    },
    {
      name: 'Sanjay',
      role: 'Counsellor',
      score: 'B',
      stats: {
        calls: 38,
        leads: 21,
        conversion: '25%',
        response: '8 min',
      },
      monthlyTarget: 70,
      progressGradient: ['#22c55e', '#facc15', '#ef4444'],
    },
     {
      name: 'Priya',
      role: 'Counsellor',
      score: 'A',
      stats: {
        calls: 52,
        leads: 35,
        conversion: '41%',
        response: '4 min',
      },
      monthlyTarget: 92,
      progressGradient: ['#22c55e', '#facc15', '#ef4444'],
    },
  ];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Employee Monitoring & KPIs</h2>
        <p className="text-gray-400 mt-2">
          Track calls, leads, conversions and scorecards for each team member.
        </p>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee, index) => (
          <div key={index} className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                <p className="text-gray-400 text-sm">{employee.role}</p>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-sm font-semibold border"
                style={{ 
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  borderColor: '#FBBF24',
                  color: '#FBBF24'
                }}
              >
                Score: {employee.score}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(employee.stats).map(([key, value]) => (
                <div key={key} className="p-4 rounded-lg" style={{ backgroundColor: '#05091B' }}>
                  <p className="text-gray-400 text-sm capitalize">{key}</p>
                  <p className="text-white text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {/* Monthly Target */}
            <div>
              <p className="text-gray-300 text-sm mb-2">Monthly Target Achievement</p>
              <ProgressBar progress={employee.monthlyTarget} gradientColors={employee.progressGradient} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeMonitoring;
