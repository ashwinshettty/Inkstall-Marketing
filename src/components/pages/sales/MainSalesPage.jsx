import React from 'react';
import SalesFilter from './SalesFilter';
import SalesMetrics from './SalesMetrics';

const Sales = () => {
  return (
    <div className="p-8 space-y-8">
        <SalesMetrics />
        <SalesFilter />
    </div>
  );
};

export default Sales;
