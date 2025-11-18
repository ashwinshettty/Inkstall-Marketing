import React, { useState } from 'react';
import Sidebar from './components/ui/Sidebar';
import Topbar from './components/ui/Topbar';
import MainDashboardPage from './components/pages/dashboard/MainDashboardPage';
import CampaignManagement from './components/pages/campaign_management/CampaignManagement';
import CreativesLibrary from './components/pages/creatives_library/CreativesLibrary';
import LeadManager from './components/pages/lead_manager/LeadManager';
import PerformanceAnalytics from './components/pages/performance_analytics/PerformanceAnalytics';
import EmployeeMonitoring from './components/pages/employee_monitoring/EmployeeMonitoring';
import TaskManager from './components/pages/task_manager/TaskManager';
import InvoicesBilling from './components/pages/invoices_billing/InvoicesBilling';
import ApprovalsCompliance from './components/pages/approvals_compliance/ApprovalsCompliance';
import Settings from './components/pages/settings/Settings';


const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const getPageTitle = () => {
    switch (currentPage) {
      case 'campaign-management':
        return 'Campaign Management';
      case 'creatives-library':
        return 'Creatives Library';
      case 'lead-manager':
        return 'Lead Manager';
      case 'performance-analytics':
        return 'Performance Analytics';
      case 'employee-monitoring':
        return 'Employee Monitoring';
      case 'task-manager':
        return 'Task Manager';
      case 'invoices-billing':
        return 'Invoices & Billing';
      case 'approvals-compliance':
        return 'Approvals & Compliance';
      case 'settings':
        return 'Settings';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'campaign-management':
        return <CampaignManagement />;
      case 'creatives-library':
        return <CreativesLibrary />;
      case 'lead-manager':
        return <LeadManager />;
      case 'performance-analytics':
        return <PerformanceAnalytics />;
      case 'employee-monitoring':
        return <EmployeeMonitoring />;
      case 'task-manager':
        return <TaskManager />;
      case 'invoices-billing':
        return <InvoicesBilling />;
      case 'approvals-compliance':
        return <ApprovalsCompliance />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <MainDashboardPage />;
    }
  };

  return (
    <div className="flex bg-slate-900 h-screen">
      <Sidebar currentPage={currentPage} onNavigation={handleNavigation} />
      <div className="flex-grow flex flex-col">
        <Topbar title={getPageTitle()} />
        <main className="flex-grow overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
