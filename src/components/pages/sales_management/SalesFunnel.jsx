import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeadMetrics from './LeadMetrics';
import { useAppContext } from '../../../context/AppContext';

const STAGES = [
  { id: 'new', name: 'New Leads', color: '#4CAF50', type: 'status' },
  { id: 'contacted', name: 'Contacted', color: '#8BC34A', type: 'status' },
  { id: 'branch visit', name: 'Branch Visit', color: '#FFC107', type: 'action' },
  { id: 'demo lecture', name: 'Demo Lecture', color: '#FF9800', type: 'action' },
  { id: 'converted', name: 'Converted', color: '#2196F3', type: 'status' },
];

const SalesFunnel = () => {
  const { authToken } = useAppContext();
  const [funnelData, setFunnelData] = useState([]);
  const [boardData, setBoardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) return;
      setLoading(true);

      try {
        const requests = STAGES.map(stage => {
          const url = stage.type === 'status'
            ? `${import.meta.env.VITE_API_URL}/api/marketing/sales-management/status?status=${stage.id}`
            : `${import.meta.env.VITE_API_URL}/api/sales/type?type=${stage.id}`;
          return axios.get(url, { headers: { Authorization: `Bearer ${authToken}` } });
        });

        const responses = await Promise.all(requests);

        const newFunnelData = STAGES.map((stage, index) => ({
          ...stage,
          count: responses[index].data.count || 0,
        }));

        const newBoardData = responses.reduce((acc, response, index) => {
          const stageId = STAGES[index].id;
          acc[stageId] = response.data.leads || response.data.data || [];
          return acc;
        }, {});

        setFunnelData(newFunnelData);
        setBoardData(newBoardData);

      } catch (error) {
        console.error('Failed to fetch funnel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  const handleDragStart = (lead, stageId) => setDraggedLead({ ...lead, fromStage: stageId });
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetStageId) => {
    if (!draggedLead || draggedLead.fromStage === targetStageId) {
      setDraggedLead(null);
      return;
    }
    // Here you would typically make an API call to update the lead's stage
    console.log(`Moving lead ${draggedLead._id} from ${draggedLead.fromStage} to ${targetStageId}`);
    setDraggedLead(null);
  };

  const getConversionRate = (index) => {
    if (index === 0 || funnelData.length === 0) return '100%';
    const currentCount = funnelData[index].count;
    const initialCount = funnelData[0].count;
    return initialCount > 0 ? `${Math.round((currentCount / initialCount) * 100)}%` : '0%';
  };

  if (loading) {
    return <div className="text-center p-10">Loading Sales Funnel...</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow">
      <LeadMetrics />
      <h2 className="text-2xl font-bold text-white mb-6">Sales Funnel</h2>

      {/* Funnel Visualization */}
      <div className="mb-8">
        {funnelData.map((stage, index) => (
          <div key={stage.id} className="flex items-center mb-2" style={{ width: `${100 - (index * 12)}%`, marginLeft: `${index * 6}%` }}>
            <div className="h-12 rounded-md flex items-center justify-between px-4 text-white font-medium" style={{ backgroundColor: stage.color, width: '100%' }}>
              <span>{stage.name}</span>
              <span className="bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {stage.count} ({getConversionRate(index)})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stages Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {funnelData.map((stage) => (
          <div key={stage.id} className="border rounded-lg overflow-hidden" onDragOver={handleDragOver} onDrop={() => handleDrop(stage.id)}>
            <div className="p-3 text-white font-medium" style={{ backgroundColor: stage.color }}>
              <div className="flex justify-between items-center">
                <span>{stage.name}</span>
                <span className="bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                  {boardData[stage.id]?.length || 0}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2 h-64 overflow-y-auto">
              {(boardData[stage.id] || []).map((lead) => (
                <div key={lead._id} className="p-3 rounded border border-gray-700 cursor-pointer" draggable onDragStart={() => handleDragStart(lead, stage.id)} style={{ backgroundColor: '#050A1B' }}>
                  <div className="font-medium text-white">{lead.student?.name || lead.title || 'Unknown'}</div>
                  <div className="text-xs text-gray-400 mt-1">Status: {stage.name}</div>
                </div>
              ))}
              {(!boardData[stage.id] || boardData[stage.id].length === 0) && (
                <div className="text-center text-gray-400 py-4 text-sm">No leads in this stage</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesFunnel;