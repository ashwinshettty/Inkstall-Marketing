import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Sales from './components/pages/sales/MainSalesPage';
import MainSalesManagement from './components/pages/sales_management/MainSalesManagement';
import Settings from './components/pages/settings/MainSettingsPage';
import LoginPage from './components/pages/login/LoginPage';
import ProfilePage from './components/pages/profile/ProfilePage';
import './index.css'


const App = () => {
  const { authToken } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/profile':
        return 'Profile';
      case '/campaign-management':
        return 'Campaign Management';
      case '/creatives-library':
        return 'Creatives Library';
      case '/lead-manager':
        return 'Lead Manager';
      case '/performance-analytics':
        return 'Performance Analytics';
      case '/employee-monitoring':
        return 'Employee Monitoring';
      case '/task-manager':
        return 'Task Manager';
      case '/invoices-billing':
        return 'Invoices & Billing';
      case '/sales':
        return 'Sales';
      case '/sales-management':
        return 'Sales Management';
      case '/settings':
        return 'Settings';
      case '/dashboard':
      default:
        return 'Dashboard';
    }
  };

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  // Check authentication on mount and route changes
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('name');
    
    if (!storedToken || !storedName) {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLoginSuccess={() => navigate('/dashboard')} />} />
      
      <Route path="/*" element={
        <div className="flex bg-slate-900 h-screen">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Sidebar currentPage={location.pathname.slice(1) || 'dashboard'} onNavigation={handleNavigation} />
          <div className="flex-grow flex flex-col">
            <Topbar title={getPageTitle()} />
            <main className="flex-grow overflow-auto">
              <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<MainDashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/campaign-management" element={<MainCampaignManagementPage />} />
                    <Route path="/creatives-library" element={<CreativesLibrary />} />
                    <Route path="/lead-manager" element={<MainLeadManagerPage />} />
                    <Route path="/performance-analytics" element={<PerformanceAnalytics />} />
                    <Route path="/employee-monitoring" element={<MainEmployeeMonitoringPage />} />
                    <Route path="/task-manager" element={<TaskManager />} />
                    <Route path="/invoices-billing" element={<InvoicesBilling />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/sales-management" element={<MainSalesManagement />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
            </main>
          </div>
        </div>
      }/>
    </Routes>
  );
};

export default App;
