import React, { useState } from 'react';
import MainCard from '../../ui/MainCard';

const CampaignSetup = () => {
  const [formData, setFormData] = useState({
    campaignName: '',
    objective: '',
    board: '',
    dailyBudget: ''
  });

  const objectives = [
    'Lead Generation',
    'Brand Awareness', 
    'Website Traffic',
    'Franchise Enquiries'
  ];

  const boards = [
    'IGCSE',
    'ICSE', 
    'CBSE',
    'IBDP',
    'AS/A Level'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <MainCard title="Campaign Setup" className="mt-6">
      <div className="space-y-6">
        {/* Horizontal Form Fields */}
        <div className="grid grid-cols-4 gap-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.campaignName}
              onChange={(e) => handleInputChange('campaignName', e.target.value)}
              className="w-full bg-[#05091B] text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
              placeholder="Enter campaign name"
            />
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Objective</label>
            <select
              value={formData.objective}
              onChange={(e) => handleInputChange('objective', e.target.value)}
              className="w-full bg-[#05091B] text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="">Select objective</option>
              {objectives.map((objective) => (
                <option key={objective} value={objective}>
                  {objective}
                </option>
              ))}
            </select>
          </div>

          {/* Board */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Board</label>
            <select
              value={formData.board}
              onChange={(e) => handleInputChange('board', e.target.value)}
              className="w-full bg-[#05091B] text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="">Select board</option>
              {boards.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>

          {/* Daily Budget */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Daily Budget (₹)</label>
            <input
              type="number"
              value={formData.dailyBudget}
              onChange={(e) => handleInputChange('dailyBudget', e.target.value)}
              className="w-full bg-[#05091B] text-white text-sm px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
              placeholder="Enter daily budget"
            />
          </div>
        </div>

        {/* AI Estimate and Buttons */}
        <div className="flex justify-between items-start pt-4">
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              AI estimate: <span className="text-[#10B981] font-medium">25–40 leads per day</span> at <span className="text-[#FBBF24] font-medium">₹350–₹450 CPL</span>.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors">
              Save as Draft
            </button>
            <button 
              className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#10B981' }}
            >
              Launch Campaign
            </button>
          </div>
        </div>
      </div>
    </MainCard>
  );
};

export default CampaignSetup;