import React, { useState } from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const LeadManagerTable = () => {
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const leads = [
    {
      name: 'Aarav Shah',
      board: 'IGCSE',
      grade: '8',
      source: 'Google Ads',
      status: 'Contacted',
      counsellor: 'Nisha',
      lastUpdate: '2h ago'
    },
    {
      name: 'Meera Gupta',
      board: 'IBDP',
      grade: '11',
      source: 'Website',
      status: 'Demo Booked',
      counsellor: 'Sanjay',
      lastUpdate: '45m ago'
    },
    {
      name: 'Kabir Mehta',
      board: 'ICSE',
      grade: '10',
      source: 'Instagram',
      status: 'New',
      counsellor: '-',
      lastUpdate: '10m ago'
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Lead Manager (CRM)</h2>
          <p className="text-gray-400">Track every parent & student from first click to enrolment.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg font-medium text-white border border-gray-600 hover:bg-gray-700 transition-colors">
            Import Leads (CSV)
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#10B981' }}
          >
            Smart Assign to Counsellors
          </button>
        </div>
      </div>

      <MainCard>
        {/* Dropdown Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Board</label>
            <select 
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Boards</option>
              <option value="igcse">IGCSE</option>
              <option value="icse">ICSE</option>
              <option value="cbse">CBSE</option>
              <option value="ibdp">IBDP</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="demo">Demo</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 px-4 py-3 border-b border-gray-700">
          <div className="text-xs text-gray-400 font-medium">Name</div>
          <div className="text-xs text-gray-400 font-medium">Board</div>
          <div className="text-xs text-gray-400 font-medium">Grade</div>
          <div className="text-xs text-gray-400 font-medium">Source</div>
          <div className="text-xs text-gray-400 font-medium">Status</div>
          <div className="text-xs text-gray-400 font-medium">Counsellor</div>
          <div className="text-xs text-gray-400 font-medium">Last Update</div>
        </div>

        {/* Table Body */}
        <InnerCard>
          <div className="space-y-1">
            {leads.map((lead, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <div className="text-white">{lead.name}</div>
                <div className="text-gray-300">{lead.board}</div>
                <div className="text-gray-300">{lead.grade}</div>
                <div className="text-gray-300">{lead.source}</div>
                <div className="text-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    lead.status === 'Contacted' 
                      ? 'bg-blue-900 text-blue-300' 
                      : lead.status === 'Demo Booked'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                <div className="text-gray-300">{lead.counsellor}</div>
                <div className="text-gray-300">{lead.lastUpdate}</div>
              </div>
            ))}
          </div>
        </InnerCard>
      </MainCard>
    </div>
  );
};

export default LeadManagerTable;