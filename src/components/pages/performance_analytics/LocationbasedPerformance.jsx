import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const LocationbasedPerformance = () => {
    const locationData = [
        { name: 'Goregaon', leads: 142, avgCPL: '₹410', progress: 100 },
        { name: 'Borivali', leads: 98, avgCPL: '₹365', progress: 98 },
        { name: 'Malad', leads: 77, avgCPL: '₹390', progress: 77 },
        { name: 'Kandivali', leads: 61, avgCPL: '₹440', progress: 61 }
    ];

    return (
        <MainCard>
            <div className="p-2">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-1">Location-based Performance</h2>
                        <p className="text-xs text-gray-400">Goregaon, Borivali, Malad, Kandivali and more.</p>
                    </div>
                </div>

                {/* Location Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {locationData.map((location, index) => (
                        <InnerCard key={index}>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-white">{location.name}</h3>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400">Leads: <span className="text-white font-medium">{location.leads}</span></p>
                                    <p className="text-xs text-gray-400">Avg CPL: <span className="text-[#FCD34D] font-medium">{location.avgCPL}</span></p>
                                </div>
                                {/* Progress Bar */}
                                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full rounded-full"
                                        style={{
                                            width: `${location.progress}%`,
                                            background: 'linear-gradient(to right, #10B981, #FCD34D, #EF4444)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </InnerCard>
                    ))}
                </div>
            </div>
        </MainCard>
    );
};

export default LocationbasedPerformance;
