import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const InvoiceTable = () => {
  const invoices = [
    {
      vendor: 'Google Ads',
      date: '01 Nov 2025',
      amount: '₹78,000',
      status: 'Paid'
    },
    {
      vendor: 'Meta Ads',
      date: '02 Nov 2025',
      amount: '₹52,000',
      status: 'Pending'
    },
    {
      vendor: 'Influencer Payouts',
      date: '03 Nov 2025',
      amount: '₹18,000',
      status: 'Pending'
    }
  ];

  return (
    <MainCard className="!bg-slate-800">
      <div className="p-4">
        {/* Table Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
          <button className="px-3 py-1 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm">
            Export CSV
          </button>
        </div>

        {/* Table */}
        <InnerCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-1 px-3 text-gray-400 font-medium text-xs">Vendor</th>
                  <th className="text-left py-1 px-3 text-gray-400 font-medium text-xs">Date</th>
                  <th className="text-left py-1 px-3 text-gray-400 font-medium text-xs">Amount</th>
                  <th className="text-left py-1 px-3 text-gray-400 font-medium text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-2 px-3 text-white text-xs">{invoice.vendor}</td>
                    <td className="py-2 px-3 text-gray-300 text-xs">{invoice.date}</td>
                    <td className="py-2 px-3 text-gray-300 text-xs">{invoice.amount}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'Paid'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InnerCard>
      </div>
    </MainCard>
  );
};

export default InvoiceTable;