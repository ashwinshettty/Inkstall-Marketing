import React from 'react';

const TopBar = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* Left side - Campaign manager description */}
      <div>
        <h1 className="text-xl font-semibold text-white mb-2">Campaign Manager</h1>
        <p className="text-xs text-gray-400">Create, track and optimise all Inkstall campaigns from one place.</p>
      </div>
      
      {/* Right side - Buttons */}
      <div className="flex gap-3">
        <button 
          className="px-4 py-2 rounded-md text-sm font-medium text-black transition-colors hover:opacity-90"
          style={{ backgroundColor: '#FBBF24' }}
        >
          New Campaign
        </button>
        <button 
          className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#0C1224' }}
        >
          Import from Google/Meta
        </button>
      </div>
    </div>
  );
};

export default TopBar;