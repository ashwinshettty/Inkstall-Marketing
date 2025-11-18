import React from 'react';

const TopbarSearch = () => {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search campaigns, leads, etc."
        className="bg-slate-800 text-white placeholder-gray-400 rounded-lg py-1.5 pl-9 pr-4 w-64"
      />
    </div>
  );
};

export default TopbarSearch;
