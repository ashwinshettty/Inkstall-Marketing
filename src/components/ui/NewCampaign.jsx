import React from 'react';

const NewCampaign = () => {
  return (
    <button className="bg-[#059669] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      New Campaign
    </button>
  );
};

export default NewCampaign;
