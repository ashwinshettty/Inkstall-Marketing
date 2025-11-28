import React, { useState } from 'react';
import LeadMetrics from './LeadMetrics';

const SalesFunnel = () => {
  // Static data for the funnel
  const funnelData = [
    { id: 'new_lead', name: 'New Leads', order: 1, count: 120, color: '#4CAF50' },
    { id: 'contacted', name: 'Contacted', order: 2, count: 80, color: '#8BC34A' },
    { id: 'branch_visit', name: 'Branch Visit', order: 3, count: 45, color: '#FFC107' },
    { id: 'demo_lecture', name: 'Demo Lecture', order: 4, count: 25, color: '#FF9800' },
    { id: 'converted', name: 'Converted', order: 5, count: 15, color: '#2196F3' },
    { id: 'lost', name: 'Lost', order: 6, count: 20, color: '#F44336' }
  ];

  // Sample lead data for each stage
  const sampleLeads = {
    new_lead: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
    contacted: ['Robert Brown', 'Emily Davis', 'Michael Wilson'],
    branch_visit: ['David Miller', 'Lisa Anderson'],
    demo_lecture: ['James Taylor', 'Emma Thomas'],
    converted: ['Daniel Jackson'],
    lost: ['Kevin White']
  };

  const [draggedLead, setDraggedLead] = useState(null);

  const handleDragStart = (lead, stageId) => {
    setDraggedLead({ ...lead, fromStage: stageId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetStageId) => {
    if (!draggedLead || draggedLead.fromStage === targetStageId) {
      setDraggedLead(null);
      return;
    }
    // In a real implementation, you would update the lead's stage here
    setDraggedLead(null);
  };

  const getConversionRate = (index) => {
    if (index === 0) return '100%';
    const current = funnelData[index].count;
    const first = funnelData[0].count;
    return first > 0 ? `${Math.round((current / first) * 100)}%` : '0%';
  };

  return (
    <div className="p-6 rounded-lg shadow">
      <LeadMetrics />
      <h2 className="text-2xl font-bold text-white mb-6">Sales Funnel</h2>

      {/* Funnel Visualization */}
      <div className="mb-8">
        {funnelData.map((stage, index) => (
          <div
            key={stage.id}
            className="flex items-center mb-2"
            style={{
              width: `${100 - (index * 12)}%`,
              marginLeft: `${index * 6}%`
            }}
          >
            <div
              className="h-12 rounded-md flex items-center justify-between px-4 text-white font-medium"
              style={{ backgroundColor: stage.color, width: '100%' }}
            >
              <span>{stage.name}</span>
              <span className=" bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {stage.count} ({getConversionRate(index)})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stages Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {funnelData.map((stage) => (
          <div
            key={stage.id}
            className="border rounded-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
          >
            <div
              className="p-3 text-white font-medium"
              style={{ backgroundColor: stage.color }}
            >
              <div className="flex justify-between items-center">
                <span>{stage.name}</span>
                <span className="bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                  {sampleLeads[stage.id]?.length || 0}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2 h-64 overflow-y-auto" >
              {sampleLeads[stage.id]?.map((lead, index) => (
                <div
                  key={index}
                  className="p-3 rounded border border-gray-200"
                  draggable
                  onDragStart={() => handleDragStart({ name: lead }, stage.id)}
                  style={{ backgroundColor: '#050A1B' }}
                >
                  <div className="font-medium text-white">{lead}</div>
                  <div className="text-xs text-gray-500 mt-1">Status: {stage.name}</div>
                </div>
              ))}
              {(!sampleLeads[stage.id] || sampleLeads[stage.id].length === 0) && (
                <div className="text-center text-gray-400 py-4 text-sm">
                  No leads in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesFunnel;