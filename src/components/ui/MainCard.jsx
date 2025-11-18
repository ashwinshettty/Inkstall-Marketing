import React from 'react';

const MainCard = ({ children, title, className = "" }) => {
  return (
    <div 
      className={`bg-[#1E293B] rounded-xl p-4 flex flex-col ${className}`}
    >
      <div>
        <h2 className="text-slate-400 text-sm font-medium">{title}</h2>
      </div>
      <div className="flex-1 flex flex-col justify-end">
        {children}
      </div>
    </div>
  );
};

export default MainCard;