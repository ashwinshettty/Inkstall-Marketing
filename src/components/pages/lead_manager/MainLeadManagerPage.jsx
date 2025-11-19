import React from 'react';
import LeadManagerTable from './LeadManagerTable';
import ManagerCard from './ManagerCard';

const LeadManager = () => {
  return (
    <div className="p-8 space-y-8">
      <LeadManagerTable />
      <ManagerCard />
    </div>
  );
};

export default LeadManager;
