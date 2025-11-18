import React from 'react';
import LeadsCard from './LeadsCard';
import AdSpendCard from './AdSpendCard';
import AvgCPLCard from './AvgCPLCard';
import OverallROICard from './OverallROICard';
import AwarenessCard from './Awareness';
import ConsiderationCard from './Consideration';
import EvaluationsCard from './Evaluations';
import EnrollmentsCard from './Enrollments';
import PerformanceOverview from './PerformanceOverview';
import DepartmentSnapshot from './DepartmentSnapshot';
import AlertCenter from './AlertCenter';
import OperationsTimeline from './OperationsTimeline';
import EmployeePerformanceReports from './EmployeePerformanceReports';
import LeadSourcePerformance from './LeadSourcePerformance';
import ConversionFunnel from './ConversionFunnel';

const MainDashboardPage = () => {
  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LeadsCard />
            <AdSpendCard />
            <AvgCPLCard />
            <OverallROICard />
            <AwarenessCard />
            <ConsiderationCard />
            <EvaluationsCard />
            <EnrollmentsCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceOverview />
            </div>
            <div className="lg:col-span-1">
              <DepartmentSnapshot />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertCenter />
            <OperationsTimeline />
          </div>
          <EmployeePerformanceReports />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LeadSourcePerformance />
            </div>
            <div className="lg:col-span-1">
              <ConversionFunnel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardPage;