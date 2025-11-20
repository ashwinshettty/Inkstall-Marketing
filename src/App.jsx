import React from 'react';
import { useAppContext } from './context/AppContext.jsx';
import Sidebar from './components/ui/Sidebar';
import Topbar from './components/ui/Topbar';
import MainDashboardPage from './components/pages/dashboard/MainDashboardPage';
import MainCampaignManagementPage from './components/pages/campaign_management/MainCampaignManagementPage';
import CreativesLibrary from './components/pages/creatives_library/CreativesLibrary';
import MainLeadManagerPage from './components/pages/lead_manager/MainLeadManagerPage';
import PerformanceAnalytics from './components/pages/performance_analytics/MainPerformanceAnalyticsPage';
import MainEmployeeMonitoringPage from './components/pages/employee_monitoring/MainEmployeeMonitoringPage';
import TaskManager from './components/pages/task_manager/MainTaskManagerPage';
import InvoicesBilling from './components/pages/invoices_billing/MainInvoicesBillingPage';
import Settings from './components/pages/settings/MainSettingsPage';
import LoginPage from './components/pages/login/LoginPage';
import ProfilePage from './components/pages/profile/ProfilePage';
import './index.css'


const App = () => {
  const { currentPage, setCurrentPage } = useAppContext();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'login':
        return 'Login';
      case 'profile':
        return 'Profile';
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
      case 'settings':
        return 'Settings';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  const { handleNavigation } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage />;
      case 'campaign-management':
        return <MainCampaignManagementPage />;
      case 'creatives-library':
        return <CreativesLibrary />;
      case 'lead-manager':
        return <MainLeadManagerPage />;
      case 'performance-analytics':
        return <PerformanceAnalytics />;
      case 'employee-monitoring':
        return <MainEmployeeMonitoringPage />;
      case 'task-manager':
        return <TaskManager />;
      case 'invoices-billing':
        return <InvoicesBilling />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <MainDashboardPage />;
    }
  };

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={() => setCurrentPage('dashboard')} />;
  }

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
