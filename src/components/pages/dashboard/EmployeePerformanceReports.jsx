import React from 'react';
import MainCard from '../../ui/MainCard';

const EmployeePerformanceReports = () => {
  const employees = [
    {
      name: 'Nisha',
      role: 'Counsellor',
      calls: 46,
      leads: 28,
      conversion: '32%',
      responseTime: '5 min',
      score: 'A',
    },
    {
      name: 'Rohit',
      role: 'Performance Marketer',
      calls: 8,
      leads: 0,
      conversion: '-',
      responseTime: '—',
      score: 'A+',
    },
    {
      name: 'Priya',
      role: 'Counsellor',
      calls: 39,
      leads: 19,
      conversion: '27%',
      responseTime: '11 min',
      score: 'B+',
    },
  ];

  return (
    <MainCard>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Employee Performance Snapshot</h2>
          <p className="text-slate-400 text-xs mt-1">Counsellors & marketers vs monthly targets.</p>
        </div>
        <button className="text-xs text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-700 transition-colors">
          View full report
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: '#05091B' }}>
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Calls</th>
              <th scope="col" className="px-6 py-3">Leads</th>
              <th scope="col" className="px-6 py-3">Conversion</th>
              <th scope="col" className="px-6 py-3">Response Time</th>
              <th scope="col" className="px-6 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="border-b border-slate-800 last:border-b-0">
                <td className="px-6 py-4 font-medium text-white">{employee.name}</td>
                <td className="px-6 py-4">{employee.role}</td>
                <td className="px-6 py-4">{employee.calls}</td>
                <td className="px-6 py-4">{employee.leads}</td>
                <td className={`px-6 py-4 ${employee.conversion !== '-' ? 'text-green-400' : ''}`}>{employee.conversion}</td>
                <td className="px-6 py-4">{employee.responseTime}</td>
                <td className="px-6 py-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full border border-yellow-500 text-yellow-500 text-xs font-bold">
                    {employee.score}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainCard>
  );
};

export default EmployeePerformanceReports;
