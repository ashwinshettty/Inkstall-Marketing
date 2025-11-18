import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const OperationsTimeline = () => {
  const timelineEvents = [
    {
      time: '09:20',
      initials: 'RO',
      title: 'Campaign budget updated',
      description: 'Rohit increased IBDP Math evening bid cap by ₹3,000.',
    },
    {
      time: '10:05',
      initials: 'NI',
      title: 'Hot lead converted',
      description: 'Nisha closed Aarav Shah (IGCSE Grade 8) after 3 follow-ups.',
    },
    {
      time: '12:15',
      initials: 'AN',
      title: 'Invoice approved',
      description: 'Anita cleared Google Ads invoice #INV-456 for ₹78,000.',
    },
  ];

  return (
    <MainCard>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">Operations Timeline</h2>
          <p className="text-slate-400 text-xs mt-1">Key actions across marketing & admissions teams.</p>
        </div>
        <button className="text-xs text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-700 transition-colors">
          Export log
        </button>
      </div>
      <InnerCard className="h-full">
        <div className="space-y-4 p-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start p-3 bg-slate-800 rounded-lg">
              <div className="flex flex-col items-center mr-4">
                <span className="text-xs text-slate-500 mb-2">{event.time}</span>
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-slate-900">
                  {event.initials}
                </div>
              </div>
              <div className="flex-grow">
                <p className="font-bold text-sm text-white">{event.title}</p>
                <p className="text-sm text-slate-300 mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </InnerCard>
    </MainCard>
  );
};

export default OperationsTimeline;
