import React from 'react';

const ProgressBar = ({ progress, gradientColors }) => {
  const gradient = `linear-gradient(to right, ${gradientColors.join(', ')})`;

  return (
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full"
        style={{ 
          width: `${progress}%`,
          background: gradient 
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
