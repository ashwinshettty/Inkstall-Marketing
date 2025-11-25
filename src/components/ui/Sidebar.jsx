import React from 'react';

const Sidebar = ({ currentPage, onNavigation }) => {
  const menuItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Campaign Manager', id: 'campaign-management' },
    { name: 'Creatives Library', id: 'creatives-library' },
    { name: 'Lead Manager', id: 'lead-manager' },
    { name: 'Performance Analytics', id: 'performance-analytics' },
    { name: 'Employee Monitoring', id: 'employee-monitoring' },
    { name: 'Task Manager', id: 'task-manager' },
    { name: 'Invoices & Billing', id: 'invoices-billing' },
    { name: 'Sales', id: 'sales' },
    { name: 'Settings', id: 'settings' },
  ];

  return (
    <div className="bg-[#0F172A] text-white h-screen w-70 min-w-[250px] flex-shrink-0 flex flex-col justify-between border-r border-slate-700">
      <div>
        <div className="flex flex-col">
          <div className="p-4 flex items-center">
            <img src="/icon/logo.png" alt="Logo" className="h-10 w-10 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-white">INKSTALL</h1>
              <p className="text-xs text-gray-400">Marketing & Performance Portal</p>
            </div>
          </div>
          <div className="border-b border-slate-700"></div>
          <nav className="mt-8">
            <ul>
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => onNavigation(item.id)}
                  className={`pl-4 pr-2 py-3 cursor-pointer flex items-center text-sm font-medium ${ 
                    currentPage === item.id
                      ? 'text-[#FBBF24] border-l-4 border-[#FBBF24] bg-slate-700'
                      : 'text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="font-bold text-sm">Marketing Manager</p>
      </div>
    </div>
  );
};

export default Sidebar;