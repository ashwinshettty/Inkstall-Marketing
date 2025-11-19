import React from 'react';

const Roles = () => {
  const rolesData = [
    {
      title: 'User Roles',
      description: 'Define what Admins, Managers, Executives and Counsellors can see and do.',
      buttonText: 'Manage Roles'
    },
    {
      title: 'Security & Access',
      description: 'Configure SSO, MFA and session policies for internal teams.',
      buttonText: 'Review Policies'
    },
    {
      title: 'Audit Trails',
      description: 'Export campaign, billing and approval logs for compliance.',
      buttonText: 'Export Logs'
    }
  ];

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rolesData.map((role, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{role.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{role.description}</p>
            </div>
            <button className="mt-auto px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm self-start">
              {role.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;