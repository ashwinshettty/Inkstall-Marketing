import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState(salesUsers);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(studentSearchTerm, 800); // 800ms delay
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    hasMore: true,
  });

  const fetchStudents = useCallback(
    async (page = 1, limit = 50, search = "") => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        console.log("Fetching students - Page:", page, "Limit:", limit);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/leads`,
          {
            params: {
              page,
              limit,
              status: "admission_due",
              sort: "createdAt",
              order: "desc",
              search: search || undefined,
            },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          const formattedStudents = response.data.students.map((student) => {
            console.log("Processing student:", student);

            // Extract contact information
            let contact = "No contact";
            if (student.contactInformation?.length > 0) {
              const primaryContact = student.contactInformation[0];
              contact =
                primaryContact.phone ||
                primaryContact.mobile ||
                primaryContact.email ||
                contact;
            }

            // Extract name from student object
            const name = student.studentName || "No Name";

            // Extract status and format it
            let status = "Admission Due";
            if (student.salesStatus) {
              status = student.salesStatus
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            }

            return {
              id: student._id,
              studentId: student.studentId || "N/A",
              name: name,
              board: student.board || "Not specified",
              branch: student.branch || "Not specified",
              contact: contact,
              grade: student.grade || "Not specified",
              subjects: Array.isArray(student.subjects) && student.subjects.length
                ? student.subjects.join(", ")
                : "Not specified",
              status: status,
              inquiryDate: student.inquiryDate
                ? new Date(student.inquiryDate).toLocaleDateString()
                : "N/A",
              assignedTo: student.assignTo?.name || "Unassigned",
              selected: false,
              rawData: student, // Keep raw data for debugging
            };
          });

          console.log("Formatted students:", formattedStudents);

          setStudentList((prev) => {
            // If it's a new search (page 1), replace the list. Otherwise, append for 'Load More'.
            return page === 1 ? formattedStudents : [...prev, ...formattedStudents];
          });

          const total = response.data.total;
          const hasMore = response.data.hasMore;
          setPagination((prev) => ({ ...prev, page, total, hasMore }));
        } else {
          setError("Failed to fetch students.");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Effect for handling debounced search
  useEffect(() => {
    // The undefined check prevents a fetch on the initial render before the value is set.
    if (debouncedSearchTerm !== undefined) {
      fetchStudents(1, 50, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchStudents]);

  const loadMoreStudents = () => {
    if (!pagination.hasMore || loading) return;
    const nextPage = pagination.page + 1;
    // Pass the current (non-debounced) search term when loading more
    fetchStudents(nextPage, pagination.limit, studentSearchTerm);
  };

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

  const filteredStudents = studentList;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const handleSearch = (e) => {
    // Only update the state here. The debounced effect will trigger the API call.
    setStudentSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 text-white">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Students */}
        <div className="md:col-span-4 bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg">Unassigned Students</h2>
              <p className="text-sm text-gray-400">
                Showing {studentList.length} of {pagination.total > 0 ? pagination.total : '...'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                Page {pagination.page}
              </span>
              {loading && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </div>

          <input
            type="text"
            className="w-full p-2 rounded bg-slate-700 border border-slate-600 mb-3"
            placeholder="Search students..."
            value={studentSearchTerm}
            onChange={handleSearch}
          />

          <div className="max-h-[65vh] overflow-y-auto space-y-2">
            {filteredStudents.length === 0 && !loading ? (
              <div className="text-center text-gray-400 py-4">
                No students found
              </div>
            ) : (
              <>
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded border transition ${
                      s.selected
                        ? "bg-blue-900 border-blue-500"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{s.name}</h3>
                        {s.studentId && (
                          <span className="text-xs text-gray-400">ID: {s.studentId}</span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={s.selected}
                        onChange={() => toggleStudent(s.id)}
                        className="mt-1"
                      />
                    </div>

                    <div className="text-sm text-slate-300 mt-1 space-y-1">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div>
                          <p className="text-gray-400">Board</p>
                          <p>{s.board}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Grade</p>
                          <p>{s.grade}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Branch</p>
                          <p>{s.branch || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Contact</p>
                          <p className="truncate max-w-[150px]">{s.contact}</p>
                        </div>
                        {s.inquiryDate && (
                          <div>
                            <p className="text-gray-400">Inquiry Date</p>
                            <p>{s.inquiryDate}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-400">Assigned To</p>
                          <p>{s.assignedTo}</p>
                        </div>
                      </div>

                      {s.status && (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-600/30 text-yellow-400">
                          {s.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
            {pagination.hasMore && (
              <div className="flex flex-col items-center mt-4 space-y-2">
                <button
                  onClick={loadMoreStudents}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : 'Load More'}
                </button>
                <p className="text-xs text-gray-400">
                  {pagination.total - studentList.length} more students available
                </p>
              </div>
            )}
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
