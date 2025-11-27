import React, { useState } from "react";

const students = [
  {
    id: 1,
    name: "IB Student",
    board: "IB",
    branch: "Goregaon West",
    contact: "9920494446 (Primary)",
    subjects: "Math, English",
    status: null,
    selected: false,
  },
  {
    id: 2,
    name: "abhay test",
    grade: "9",
    board: "ICSE",
    branch: "Goregaon West",
    contact: "undefined (Primary)",
    subjects: "Additional Mathematics",
    status: "Admission Due",
    selected: false,
  },
];

const salesUsers = [
  {
    id: 1,
    name: "Abhishek Vishwakarma",
    email: "abhishek.vishwakarma@inkstall.in",
    role: "Sales Executive",
    status: "Available",
    selected: false,
  },
  {
    id: 2,
    name: "Sneha Mackwani",
    email: "sneha.mackwani@inkstall.in",
    role: "Sales Manager",
    status: "In Meeting",
    selected: false,
  },
  {
    id: 3,
    name: "Shilpa Shetty",
    email: "shilpa.shetty@inkstall.com",
    role: "Sales Executive",
    status: "Available",
    selected: false,
  },
  {
    id: 4,
    name: "Shruti Kavale",
    email: "shruti.kavale@inkstall.in",
    role: "Sales Intern",
    status: "On Leave",
    selected: false,
  },
];

const ManualAssignment = () => {
  const [studentList, setStudentList] = useState(students);
  const [userList, setUserList] = useState(salesUsers);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const toggleStudent = (id) => {
    setStudentList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const toggleUser = (id) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u))
    );
  };

  const filteredStudents = studentList.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const filteredUsers = userList.filter((u) =>
    JSON.stringify(u).toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "In Meeting":
        return "bg-yellow-500";
      case "On Leave":
        return "bg-red-500";
      case "Admission Due":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="p-4 text-white">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Students */}
        <div className="md:col-span-4 bg-slate-800 p-4 rounded-lg">
          <h2 className="text-lg mb-3">Unassigned Students ({filteredStudents.length})</h2>

          <input
            type="text"
            className="w-full p-2 rounded bg-slate-700 border border-slate-600 mb-3"
            placeholder="Search students..."
            value={studentSearchTerm}
            onChange={(e) => setStudentSearchTerm(e.target.value)}
          />

          <div className="max-h-[65vh] overflow-y-auto space-y-2">
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded border transition ${
                  s.selected
                    ? "bg-blue-900 border-blue-500"
                    : "bg-slate-700 border-slate-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{s.name}</h3>
                  <input
                    type="checkbox"
                    checked={s.selected}
                    onChange={() => toggleStudent(s.id)}
                  />
                </div>

                <div className="text-sm text-slate-300 mt-1 space-y-1">
                  {s.grade && <p>Grade: {s.grade}</p>}
                  <p>Board: {s.board}</p>
                  <p>Branch: {s.branch}</p>
                  <p>Contact: {s.contact}</p>
                  <p>Subjects: {s.subjects}</p>

                  {s.status && (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-600/30 text-yellow-400">
                      {s.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Users */}
        <div className="md:col-span-3 bg-slate-800 p-4 rounded-lg">
          <h2 className="text-lg mb-3">Available Sales Users</h2>

          <input
            type="text"
            className="w-full p-2 rounded bg-slate-700 border border-slate-600 mb-3"
            placeholder="Search users..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />

          <div className="max-h-[65vh] overflow-y-auto space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className={`p-3 rounded border flex items-start gap-3 transition ${
                  u.selected
                    ? "bg-blue-900 border-blue-500"
                    : "bg-slate-700 border-slate-600"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-semibold"
                >
                  {getInitials(u.name)}
                </div>

                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{u.name}</p>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(u.status)}`}></span>
                    <p className="text-xs text-slate-400">{u.status}</p>
                  </div>

                  <p className="text-xs text-slate-400">{u.email}</p>
                  <p className="text-xs text-slate-400">{u.role}</p>
                </div>

                <input
                  type="checkbox"
                  checked={u.selected}
                  onChange={() => toggleUser(u.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button className="px-4 py-2 border border-slate-600 rounded text-slate-300">
          Cancel
        </button>

        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          Assign Selected
        </button>
      </div>
    </div>
  );
};

export default ManualAssignment;
