import React from 'react';
import { filterLeadsByDateRange, groupLeadsByStatus, getDateRangeText } from '../../../../utils/dateUtils';

const LastWeek = ({ leads = [] }) => {
  // Filter leads from the last 7 days and group by status
  const recentLeads = filterLeadsByDateRange(leads, 7);
  const leadsByStatus = groupLeadsByStatus(recentLeads);
  const dateRange = getDateRangeText(7);
  const hasLeads = recentLeads.length > 0;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Last Week Analytics</h2>
      <p className="text-sm text-gray-400 mb-4">{dateRange}</p>
      
      {hasLeads ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(leadsByStatus).map(([status, leads]) => (
            <div key={status} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium capitalize">{status}</h3>
              <p className="text-2xl font-bold">{leads.length}</p>
              <p className="text-sm text-gray-400">
                {leads.length === 1 ? 'Lead' : 'Leads'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No leads were active in the last week.</p>
        </div>
      )}
    </div>
  );
};

export default LastWeek;
