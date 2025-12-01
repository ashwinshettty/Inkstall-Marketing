import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ManualAssignmentModal } from './ManualAssignmentModal';

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

const ManualAssignment = () => {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState(null);
  const [assignmentInProgress, setAssignmentInProgress] = useState(false);
  const debouncedSearchTerm = useDebounce(studentSearchTerm, 800);

  const fetchUnassignedStudents = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/marketing/unassigned-students`,
        {
          headers: { 'Authorization': `Bearer ${authToken}` },
        }
      );
      if (response.data && response.data.success) {
        setStudentList(response.data.students || []);
      }
    } catch (error) {
      console.error('Error fetching unassigned students:', error);
      setError('Failed to load unassigned students');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/marketing/users`,
        {
          headers: { 'Authorization': `Bearer ${authToken}` },
        }
      );
      if (response.data && response.data.success && Array.isArray(response.data.users)) {
        const formattedUsers = response.data.users.map(user => ({
          id: user._id || user.id,
          name: user.name || 'No Name',
          email: user.email || 'No Email',
          role: user.roles && user.roles.length > 0 ? user.roles[0] : 'Sales',
          status: 'Available',
          profilePhoto: user.localPhotoUrl || user.profilePhotoUrl,
          selected: false
        }));
        setUserList(formattedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError('Failed to load sales users.');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnassignedStudents();
    fetchUsers();
  }, [fetchUnassignedStudents, fetchUsers]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const toggleStudent = (id) => {
    setStudentList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  // Toggle user selection
  const toggleUser = (userId) => {
    setUserList(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, selected: !user.selected } : { ...user, selected: false }
      )
    );
    
    // Set the selected user for assignment
    const selectedUser = userList.find(user => user.id === userId);
    setSelectedUserForAssignment(selectedUser?.selected ? null : selectedUser);
  };
  
  // Get selected students
  const selectedStudents = useMemo(() => {
    return studentList.filter(student => student.selected);
  }, [studentList]);
  
  // Handle assignment
  const handleAssignStudents = () => {
    if (selectedStudents.length === 0 || !selectedUserForAssignment) return;
    setAssignmentModalOpen(true);
  };
  
  // Handle successful assignment
  const handleAssignmentSuccess = () => {
    // Clear selections after successful assignment
    setStudentList(prev => prev.map(s => ({ ...s, selected: false })));
    setUserList(prev => prev.map(u => ({ ...u, selected: false })));
    setSelectedUserForAssignment(null);
    setAssignmentModalOpen(false);
    
    // Show success message or refresh data if needed
    // You might want to add a toast notification here
  };

  const filteredStudents = studentList.filter(student =>
    (student.studentName?.toLowerCase() || '').includes(studentSearchTerm.toLowerCase()) ||
    (student.studentId?.toLowerCase() || '').includes(studentSearchTerm.toLowerCase())
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

  if (loading || usersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || usersError) {
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
              <h2 className="text-lg font-semibold">
                Unassigned Students
                <span className="text-sm text-gray-400 ml-2">({filteredStudents.length} found)</span>
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                Page {1}
              </span>
            </div>
          </div>

          <input
            type="text"
            className="w-full p-2 rounded bg-slate-700 border border-slate-600 mb-3"
            placeholder="Search students..."
            value={studentSearchTerm}
            onChange={handleSearch}
          />

          <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-2">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
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
                      <h3 className="font-semibold">{s.studentName || 'No Name'}</h3>
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
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p>No unassigned students found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sales Users */}
        <div className="md:col-span-3 bg-slate-800 p-4 rounded-lg flex flex-col h-full">
          {/* Header */}
          <h2 className="text-lg font-semibold text-white mb-3">Available Users</h2>
          
          {/* Search and Assign Button */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={handleAssignStudents}
              disabled={!selectedUserForAssignment || selectedStudents.length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                selectedUserForAssignment && selectedStudents.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Assign
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto space-y-2">
            {usersLoading ? (
              <div className="text-center text-gray-400 py-4">Loading users...</div>
            ) : userList.length === 0 ? (
              <div className="text-center text-gray-400 py-4">No users found</div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className={`p-3 rounded border flex items-start gap-3 transition ${
                    u.selected
                      ? "bg-blue-900 border-blue-500"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  {u.profilePhoto ? (
                    <img 
                      src={u.profilePhoto} 
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-10 h-10 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-semibold';
                        fallback.textContent = getInitials(u.name);
                        e.target.parentNode.insertBefore(fallback, e.target);
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-semibold">
                      {getInitials(u.name)}
                    </div>
                  )}

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
              ))
            )}
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
      
      {/* Assignment Modal */}
      <ManualAssignmentModal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        selectedStudents={selectedStudents}
        selectedUser={selectedUserForAssignment}
        onSuccess={handleAssignmentSuccess}
      />
    </div>
  );
};

export default ManualAssignment;
