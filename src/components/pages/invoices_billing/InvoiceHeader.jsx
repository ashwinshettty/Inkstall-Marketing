import React from 'react';
import MainCard from '../../ui/MainCard';
import ProgressBar from '../../ui/ProgressBar';

const InvoiceHeader = () => {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Invoices & Billing</h2>
        <p className="text-gray-400 mt-2">
          Control spend, reconcile invoices and monitor budget utilisation.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Budget Card */}
        <MainCard className="!bg-slate-800">
          <div className="p-2">
            <h3 className="text-sm font-semibold text-white mb-2">Budget (This Month)</h3>
            <div className="text-2xl font-bold text-white mb-1">₹2,50,000</div>
            <div className="text-gray-400 text-sm mb-3">Used: ₹1,84,000 (73%)</div>
            <ProgressBar progress={73} gradientColors={['#22c55e', '#facc15', '#ef4444']} />
          </div>
        </MainCard>

        {/* Pending Invoices Card */}
        <MainCard className="!bg-slate-800">
          <div className="p-2">
            <h3 className="text-sm font-semibold text-white mb-2">Pending Invoices (Count)</h3>
            <div className="text-2xl font-bold text-white mb-1">2</div>
            <div className="text-gray-400 text-sm mb-4">Total pending: <span style={{ color: '#F0B100' }}>₹70,000</span></div>
          </div>
        </MainCard>

        {/* Forecast Overshoot Card */}
        <MainCard className="!bg-slate-800">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Forecast Overshoot</h3>
            <div className="text-2xl font-bold mb-1 text-red-500">₹18,000</div>
            <div className="text-gray-400 text-xs mb-4">
              Reduce bids or pause low ROI campaigns to stay in limit.
            </div>
          </div>
        </MainCard>
      </div>
    </div>
  );
};

export default InvoiceHeader;