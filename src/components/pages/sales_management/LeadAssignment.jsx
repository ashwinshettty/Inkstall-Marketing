import React, { useState } from "react";
import ManualAssignment from "./ManualAssignment";
import Enquiries from "./Enquiries";
import RoundRobin from "./RoundRobin";
import DepartmentBased from "./DepartmentBased";

const LeadAssignment = () => {
  const [value, setValue] = useState(0);

  const tabs = [
    "Manual Assignment",
    "Enquiries",
    "Round-Robin",
    "Department-Based",
  ];

  return (
    <div className="p-4 text-white">

      {/* Page Title */}
      <h2 className="text-xl font-semibold mb-2">Lead Assignment</h2>

      {/* Success Message */}
      <div className="bg-green-600/20 border border-green-600 text-green-300 p-3 rounded mb-4">
        Lead assigned successfully
      </div>

      {/* Section Heading */}
      <h3 className="text-sm text-slate-300 mb-2">Assignment Method</h3>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setValue(index)}
            className={`px-4 py-2 text-sm transition 
              ${
                value === index
                  ? "border-b-2 border-blue-500 text-blue-400 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {value === 0 && <ManualAssignment />}
        {value === 1 && <Enquiries />}
        {value === 2 && <RoundRobin />}
        {value === 3 && <DepartmentBased />}
      </div>
    </div>
  );
};

export default LeadAssignment;
