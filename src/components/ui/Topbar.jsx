import React from 'react';
import TopbarSearch from './TopbarSearch';
import NewCampaign from './NewCampaign';

const Topbar = ({ title }) => {
  return (
    <div className="bg-slate-900 text-white p-2 flex items-center justify-between border-b border-slate-700">
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-2">{title}</h1>
        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded-full">
          Inkstall HQ - Mumbai
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TopbarSearch />
        <NewCampaign />
        <div className="flex items-center">
          <div className="mr-2 text-right">
            <p className="font-semibold text-xs">Ashwin (Admin)</p>
            <p className="text-[10px] text-gray-400">Super Admin</p>
          </div>
          <div className="bg-yellow-500 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
            AS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
