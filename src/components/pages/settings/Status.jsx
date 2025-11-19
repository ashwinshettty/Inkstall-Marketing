import React from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';

const Status = () => {
  const integrations = [
    {
      name: 'Google Ads',
      lastSynced: '8m ago',
      status: 'Connected',
      statusColor: 'green'
    },
    {
      name: 'Meta Ads',
      lastSynced: '11m ago',
      status: 'Connected',
      statusColor: 'green'
    },
    {
      name: 'WhatsApp Cloud API',
      lastSynced: '15m ago',
      status: 'Connected',
      statusColor: 'green'
    },
    {
      name: 'HubSpot CRM',
      lastSynced: '—',
      status: 'Pending Auth',
      statusColor: 'yellow'
    }
  ];

  const alertPolicies = [
    {
      name: 'Budget overshoot > 15%',
      status: 'Enabled',
      statusColor: 'green'
    },
    {
      name: 'Hot lead inactivity > 6h',
      status: 'Enabled',
      statusColor: 'green'
    },
    {
      name: 'Creative approvals pending > 24h',
      status: 'Disabled',
      statusColor: 'gray'
    }
  ];

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integration Status */}
        <MainCard className="!bg-slate-800 h-full">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Integration Status</h3>
              <p className="text-gray-400 text-sm">Connect ad platforms, messaging, CRM and analytics suites.</p>
              <button className="mt-3 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm">
                Manage Integrations
              </button>
            </div>

            <InnerCard>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="text-white font-medium">{integration.name}</div>
                      <div className="text-gray-400 text-sm">Last synced: {integration.lastSynced}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        integration.statusColor === 'green'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : integration.statusColor === 'yellow'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                ))}
              </div>
            </InnerCard>
          </div>
        </MainCard>

        {/* Alert Policies */}
        <MainCard className="!bg-slate-800 h-full">
          <div className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Alert Policies</h3>
              <p className="text-gray-400 text-sm">Automate monitoring for budgets, leads and approvals.</p>
              <button className="mt-3 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm">
                Configure Alerts
              </button>
            </div>

            <InnerCard>
              <div className="space-y-4">
                {alertPolicies.map((policy, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="text-white font-medium">{policy.name}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        policy.statusColor === 'green'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : policy.statusColor === 'yellow'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {policy.status}
                    </span>
                  </div>
                ))}
              </div>
            </InnerCard>
          </div>
        </MainCard>
      </div>
    </div>
  );
};

export default Status;