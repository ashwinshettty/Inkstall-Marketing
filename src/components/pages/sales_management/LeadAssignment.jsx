import React, { useState } from "react";
import ManualAssignment from "./ManualAssignment";
import Enquiries from "./Enquiries";
import SubjectForm from "./SubjectForm";

const LeadAssignment = () => {
  const [value, setValue] = useState(0);

  const tabs = [
    "Manual Assignment",
    "Enquiries",
    "Subject-Form",
  ];

  return (
    <div className="p-4 text-white">
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
        {value === 2 && <SubjectForm />}
      </div>
    </div>
  );
};

export default LeadAssignment;
