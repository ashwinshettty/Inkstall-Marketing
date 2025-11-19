import React from 'react';
import TopBar from './TopBar';
import CampaignTable from './CampaignTable';
import CampaignSetup from './CampaignSetup';

const CampaignManagement = () => {
  return (
    <div className="p-8">
      <TopBar />
      <CampaignTable />
      <CampaignSetup />
    </div>
  );
};

export default CampaignManagement;