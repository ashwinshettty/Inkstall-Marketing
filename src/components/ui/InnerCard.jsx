import React from 'react';

const InnerCard = ({ children, className = "", height = "", width = "" }) => {
  const styleProps = {};
  if (height) styleProps.height = height;
  if (width) styleProps.width = width;

  return (
    <div 
      className={`bg-[#050A1B] rounded-xl p-4 flex flex-col justify-between ${className}`}
      style={styleProps}
    >
      {children}
    </div>
  );
};

export default InnerCard;