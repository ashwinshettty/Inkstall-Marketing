import React, { useState } from 'react';
import CampaignTableHead from './CampaignTableHead';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const CampaignTable = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const campaigns = [
    {
      name: "IGCSE Science – Goregaon",
      platform: "Google Ads",
      status: "Active",
      spend: "₹45,000",
      leads: 120,
      cpl: "₹375",
      roi: "3.8x",
      manager: "Anita"
    },
    {
      name: "IBDP Math – Mumbai",
      platform: "Meta Ads",
      status: "Paused",
      spend: "₹22,000",
      leads: 38,
      cpl: "₹579",
      roi: "2.1x",
      manager: "Rohit"
    },
    {
      name: "ICSE 10th – Borivali",
      platform: "Google Ads",
      status: "Active",
      spend: "₹30,500",
      leads: 91,
      cpl: "₹335",
      roi: "4.2x",
      manager: "Priya"
    }
  ];

  return (
    <>
      <MainCard title="Campaign Overview">
        <CampaignTableHead />
     
      
      {/* Dropdowns Section */}
      <div className="flex justify-between items-center mb-4 mt-4">
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Platform</label>
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#1E293B] text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Platforms</option>
              <option value="google">Google Ads</option>
              <option value="meta">Meta Ads</option>
              <option value="seo">SEO</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#1E293B] text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        
        <div className="text-right mr-5 mt-4">
          <p className="text-lg font-semibold text-white">{campaigns.length} campaigns</p>
        </div>
      </div>

      {/* Campaign Table */}
      <InnerCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-xs text-gray-400 pb-3">Campaign</th>
                <th className="text-left text-xs text-gray-400 pb-3">Platform</th>
                <th className="text-left text-xs text-gray-400 pb-3">Status</th>
                <th className="text-left text-xs text-gray-400 pb-3">Spend</th>
                <th className="text-left text-xs text-gray-400 pb-3">Leads</th>
                <th className="text-left text-xs text-gray-400 pb-3">CPL</th>
                <th className="text-left text-xs text-gray-400 pb-3">ROI</th>
                <th className="text-left text-xs text-gray-400 pb-3">Manager</th>
                <th className="text-left text-xs text-gray-400 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-3 text-sm text-white">{campaign.name}</td>
                  <td className="py-3 text-sm text-gray-300">{campaign.platform}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      campaign.status === 'Active' 
                        ? 'bg-green-900 text-green-300' 
                        : campaign.status === 'Paused'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-300">{campaign.spend}</td>
                  <td className="py-3 text-sm text-gray-300">{campaign.leads}</td>
                  <td className="py-3 text-sm text-gray-300">{campaign.cpl}</td>
                  <td className="py-3 text-sm text-gray-300">{campaign.roi}</td>
                  <td className="py-3 text-sm text-gray-300">{campaign.manager}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-blue-400 hover:text-blue-300 px-3 py-1 rounded-full border border-blue-400 hover:bg-blue-400 hover:text-white transition-colors">
                        Edit
                      </button>
                      <button className="text-sm text-blue-400 hover:text-blue-300 w-6 h-6 rounded-full border border-blue-400 hover:bg-blue-400 hover:text-white transition-colors flex items-center justify-center">
                        ⋯
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InnerCard>
       </MainCard>
    </>
  );
};

export default CampaignTable;