import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ManualAssignmentModal = ({ isOpen, onClose, selectedStudents, selectedUser, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sales_status: 'new',
    priority: 'medium',
    source: 'website',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedStudents.length) return;

    setLoading(true);
    setError('');

    try {
      const authToken = localStorage.getItem('authToken');
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      // Extract student IDs from selected students
      const studentIds = selectedStudents.map(student => 
        typeof student === 'object' ? student.id : student
      );

      // Call the bulk assignment API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/marketing/sales-management/bulk-assign`,
        {
          userId: selectedUser.id,
          userName: selectedUser.name,
          userRole: selectedUser.role || 'sales',
          studentIds: studentIds,
          salesStatus: formData.sales_status,
          source: formData.source,
          notes: formData.notes,
          assignedBy: currentUser.id,
          assignedDate: new Date().toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Successfully assigned ${response.data.assignedCount} student(s) to ${selectedUser.name}`);
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to assign students');
      }
    } catch (err) {
      console.error('Error assigning students:', err);
      const errorMessage = err.response?.data?.message || 'Failed to assign students. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assign Students</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assigning to
            </label>
            <div className="p-3 bg-slate-700 rounded border border-slate-600">
              <div className="flex items-center gap-3">
                {selectedUser?.profilePhoto ? (
                  <img 
                    src={selectedUser.profilePhoto} 
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-semibold">
                    {selectedUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{selectedUser?.name}</p>
                  <p className="text-sm text-gray-300">{selectedUser?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Students to Assign ({selectedStudents.length})
            </label>
            <div className="max-h-40 overflow-y-auto border border-slate-600 rounded p-2 bg-slate-700">
              {selectedStudents.map((student, index) => {
                // Get the student name from the student object
                const studentName = student.studentName || student.name || `Student ${index + 1}`;
                return (
                  <div key={index} className="py-1 px-2 text-sm text-gray-200">
                    {studentName}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              name="sales_status"
              value={formData.sales_status}
              onChange={handleChange}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              required
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              required
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              required
            >
              <option value="website">Website</option>
              <option value="walkin">Walk-in</option>
              <option value="call">Phone Call</option>
              <option value="social">Social Media</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Add any notes about this assignment..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Students'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualAssignmentModal;
