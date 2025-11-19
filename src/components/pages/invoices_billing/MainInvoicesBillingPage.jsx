import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import InvoiceTable from './InvoiceTable';

const InvoicesBilling = () => {
  return (
    <div>
      <InvoiceHeader />
      <div className="p-8">
        <InvoiceTable />
      </div>
    </div>
  );
};

export default InvoicesBilling;
