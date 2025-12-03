import React from 'react';
import { groupLeadsByStatus } from '../../../../utils/dateUtils';

const AllTime = ({ leads = [] }) => {
  // Group all leads by status
  const leadsByStatus = groupLeadsByStatus(leads);
  const totalLeads = leads.length;
  const hasLeads = totalLeads > 0;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">All Time Analytics</h2>
      <p className="text-sm text-gray-400 mb-4">Total Leads: {totalLeads}</p>
      
      {hasLeads ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(leadsByStatus).map(([status, leads]) => (
            <div key={status} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium capitalize">{status}</h3>
              <p className="text-2xl font-bold">{leads.length}</p>
              <p className="text-sm text-gray-400">
                {leads.length === 1 ? 'Lead' : 'Leads'} • {Math.round((leads.length / totalLeads) * 100) || 0}%
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No leads found in the system.</p>
        </div>
      )}
    </div>
  );
};

export default AllTime;
