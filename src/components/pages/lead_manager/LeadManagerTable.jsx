import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';
import PhoneModal from './PhoneModal';
import StudentDetailsModal from './StudentDetailsModal';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const LeadManagerTable = () => {
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSaleStatus, setSelectedSaleStatus] = useState('all');
  const [selectedCounsellor, setSelectedCounsellor] = useState('all');
  const [searchName, setSearchName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [allLeads, setAllLeads] = useState([]); // Stores all leads from backend
  const [leads, setLeads] = useState([]); // Leads for the current UI page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendPage, setBackendPage] = useState(1); // To track backend page
  const [hasMoreBackendData, setHasMoreBackendData] = useState(true);
  const [frontendPage, setFrontendPage] = useState(1); // To track UI page
  const FRONTEND_PAGE_SIZE = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch leads from the backend
  const fetchLeadsFromBackend = async (pageToFetch) => {
    if (loading || !hasMoreBackendData) return;

    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      console.log(`Fetching page ${pageToFetch} with token:`, authToken ? 'Token exists' : 'No token');
      
      const response = await api.get('/api/leads', {
        params: { page: pageToFetch },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('API Response:', response);
      console.log('Response data:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (response.data.success) {
        // Ensure we have an array of students
        const students = Array.isArray(response.data.students) ? response.data.students : [];
        
        const mappedLeads = students.map(student => ({
          id: student._id,
          name: student.studentName || '-',
          board: student.board || '-',
          grade: student.grade || '-',
          source: student.source || '-',
          status: student.status || '-',
          displayStatus: student.status === 'admissiondue' ? 'Admission Due' : student.status === 'active' ? 'Active' : student.status || '-',
          salesStatus: student.salesStatus || '-',
          counsellor: student.assignTo?.name || '-',
          phone: student.contactInformation?.[0]?.number || '',
          contactInformation: student.contactInformation || [],
          subjects: student.subjects || []  // Ensure subjects is always an array
        }));

        // Use functional update to prevent state batching issues
        setAllLeads(prev => {
          // If it's the first page, replace the data, otherwise append
          const newLeads = pageToFetch === 1 ? mappedLeads : [...prev, ...mappedLeads];
          // Remove duplicates based on student ID
          const uniqueLeads = Array.from(new Map(newLeads.map(lead => [lead.id, lead])).values());
          return uniqueLeads;
        });
        
        // Safely access pagination with fallbacks
        const total = response.data.total || 0;
        const totalPages = response.data.pagination?.totalPages || 1;
        
        setBackendPage(pageToFetch);
        setHasMoreBackendData(pageToFetch < totalPages);
      } else {
        console.error('API did not return success:', response.data);
        setError(response.data.message || 'Failed to fetch leads');
      }
    } catch (err) {
      console.error('Error in fetchLeadsFromBackend:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeadsFromBackend(1);
  }, []);

  // Update UI-visible leads when allLeads or frontendPage changes
  useEffect(() => {
    const startIndex = (frontendPage - 1) * FRONTEND_PAGE_SIZE;
    const endIndex = startIndex + FRONTEND_PAGE_SIZE;
    const leadsForPage = allLeads.slice(startIndex, endIndex);
    setLeads(leadsForPage);

    // Check if we need to fetch more data for the next page
    const requiredLeadsCount = frontendPage * FRONTEND_PAGE_SIZE;
    if (allLeads.length < requiredLeadsCount + FRONTEND_PAGE_SIZE && hasMoreBackendData) {
      fetchLeadsFromBackend(backendPage + 1);
    }
  }, [allLeads, frontendPage]);

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const updatedDate = new Date(date);
    const diffMs = now - updatedDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return updatedDate.toLocaleDateString();
  };

  // Get unique counsellors for filter dropdown
  const uniqueCounsellors = ['all', ...new Set(allLeads.map(lead => lead.counsellor).filter(c => c && c !== '' && c !== '-'))];

  // Filter leads based on selected filters
  const filteredLeads = allLeads.filter(lead => {
    const boardMatch = selectedBoard === 'all' || lead.board.toLowerCase() === selectedBoard.toLowerCase();
    const statusMatch = selectedStatus === 'all' || lead.status.toLowerCase() === selectedStatus.toLowerCase();
    const saleStatusMatch = selectedSaleStatus === 'all' || lead.salesStatus.toLowerCase() === selectedSaleStatus.toLowerCase();
    const counsellorMatch = selectedCounsellor === 'all' || lead.counsellor === selectedCounsellor;
    const nameMatch = searchName === '' || lead.name.toLowerCase().includes(searchName.toLowerCase());
    return boardMatch && statusMatch && saleStatusMatch && counsellorMatch && nameMatch;
  });

  // Frontend Pagination calculations
  const totalFrontendPages = Math.ceil(filteredLeads.length / FRONTEND_PAGE_SIZE);
  const indexOfLastItem = frontendPage * FRONTEND_PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - FRONTEND_PAGE_SIZE;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters change
  useEffect(() => {
    setFrontendPage(1);
  }, [selectedBoard, selectedStatus, selectedSaleStatus, selectedCounsellor, searchName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) {
        setStatusDropdown(null);
      }
    };

    if (statusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [statusDropdown]);

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setFrontendPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setFrontendPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setFrontendPage(prev => Math.min(prev + 1, totalFrontendPages));
  };

  // Handle phone icon click
  const handlePhoneClick = (lead) => {
    setSelectedStudent(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Handle row click to show student details
  const handleRowClick = async (lead) => {
    console.log('Row clicked:', lead);
    try {
      setLoadingDetails(true);
      setIsDetailsModalOpen(true);
      const authToken = localStorage.getItem('authToken');
      
      console.log('Fetching student details for ID:', lead.id);
      const { data } = await api.get(`/api/students/${lead.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Student details response:', data);
      if (data.success) {
        setSelectedStudentDetails(data.student);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedStudentDetails(null);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    console.log('handleStatusChange called with:', { leadId, newStatus });
    try {
      setIsLoading(true);
      console.log('Making API call to:', `/api/leads/students/${leadId}/salesStatus`);
      const response = await api.patch(`/api/leads/students/${leadId}/salesStatus`, {
        salesStatus: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      console.log('API response:', response);

      // Update the lead in the leads array
      setAllLeads(leads => {
        const updatedLeads = leads.map(lead =>
          lead.id === leadId
            ? { ...lead, salesStatus: newStatus }
            : lead
        );
        console.log('Updated leads:', updatedLeads.find(lead => lead.id === leadId));
        return updatedLeads;
      });

      setStatusDropdown(null); // Close the dropdown
      console.log('Status change completed successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    {
      value: 'New',
      label: 'New',
      labelColor: 'text-blue-500',
      icon: <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
    },
    {
      value: 'Contacted',
      label: 'Contacted',
      labelColor: 'text-yellow-500',
      icon: <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    },
    {
      value: 'Qualified',
      label: 'Qualified',
      labelColor: 'text-purple-500',
      icon: <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      value: 'Converted',
      label: 'Converted',
      labelColor: 'text-green-500',
      icon: <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    },
    {
      value: 'Lost',
      label: 'Lost',
      labelColor: 'text-red-500',
      icon: <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
    },
    {
      value: 'Delegate',
      label: 'Delegate',
      labelColor: 'text-orange-500',
      icon: <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Lead Manager (CRM)</h2>
          <p className="text-gray-400 mt-1">Track every parent & student from first click to enrolment.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg font-medium text-white border border-gray-600 hover:bg-gray-700 transition-colors">
            Import Leads (CSV)
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#10B981' }}
          >
            Smart Assign to Counsellors
          </button>
        </div>
      </div>

      <MainCard>
        {/* Show Filters Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Search Student</label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-500"
                />
              </div>

              {/* Board Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Board</label>
                <select 
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All Boards</option>
                  <option value="igcse">IGCSE</option>
                  <option value="icse">ICSE</option>
                  <option value="cbse">CBSE</option>
                  <option value="ibdp">IBDP</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="admissiondue">Admission Due</option>
                </select>
              </div>
              
              {/* Sale Status Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Sale Status</label>
                <select 
                  value={selectedSaleStatus}
                  onChange={(e) => setSelectedSaleStatus(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Counsellor Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Counsellor</label>
                <select 
                  value={selectedCounsellor}
                  onChange={(e) => setSelectedCounsellor(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-400"
                >
                  {uniqueCounsellors.map((counsellor, index) => (
                    <option key={index} value={counsellor}>
                      {counsellor === 'all' ? 'All Counsellors' : counsellor || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table Header */}
        <div className="grid grid-cols-[1.3fr_0.5fr_0.5fr_2.7fr_0.7fr_1fr_1fr_0.5fr] gap-2 pl-6 pr-4 py-3 border-b border-gray-700 items-start">
          <div className="text-xs text-gray-400 font-medium truncate pl-2">Name</div>
          <div className="text-xs text-gray-400 font-medium truncate pl-2">Board</div>
          <div className="text-xs text-gray-400 font-medium pl-2">Grade</div>
          <div className="text-xs text-gray-400 font-medium pl-2">Subjects</div>
          <div className="text-xs text-gray-400 font-medium truncate pr-6">Source</div>
          <div className="text-xs text-gray-400 font-medium pr-6">Status</div>
          <div className="text-xs text-gray-400 font-medium truncate pr-6">Counsellor</div>
          <div className="text-xs text-gray-400 font-medium pr-6">Actions</div>
        </div>

        {/* Table Body */}
        <InnerCard>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading leads...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No leads found</div>
          ) : (
            <div className="space-y-1">
              {currentLeads.map((lead, index) => (
                <div 
                  key={lead.id || index} 
                  className="grid grid-cols-[1.4fr_0.6fr_0.5fr_2.9fr_0.7fr_1fr_1fr_0.5fr] gap-2 px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer items-start" 
                  onClick={() => handleRowClick(lead)}
                >
                  <div className="text-white truncate" title={lead.name}>{lead.name}</div>
                  <div className="text-gray-300 truncate" title={lead.board}>{lead.board}</div>
                  <div className="text-gray-300">{lead.grade}</div>
                  <div className="text-gray-300">
                    {lead.subjects?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {lead.subjects.map((subject, index) => {
                          const subjectName = typeof subject === 'string' ? subject : (subject.name || subject.subjectName || '-');
                          return (
                            <span 
                              key={index} 
                              className="px-1.5 py-0.5 bg-indigo-900/30 text-indigo-300 rounded-full text-[11px] border border-indigo-700 whitespace-nowrap truncate max-w-[100px]"
                              title={subjectName}
                            >
                              {subjectName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                  <div className="text-gray-300 truncate" title={lead.source}>{lead.source}</div>
                  <div className="text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lead.displayStatus === 'Admission Due' 
                        ? 'bg-yellow-900 text-yellow-300' 
                        : lead.displayStatus === 'Active'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {lead.displayStatus}
                    </span>
                  </div>
                  <div className="text-gray-300 truncate">{lead.counsellor}</div>
                  <div className="text-gray-300">
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhoneClick(lead);
                        }}
                        title="View contact information"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button 
                          className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusDropdown(statusDropdown === lead.id ? null : lead.id);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="5" cy="12" r="1"></circle>
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                          </svg>
                        </button>
                        
                        {statusDropdown === lead.id && (
                          <div className="status-dropdown absolute right-0 mt-1 w-56 bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-700 overflow-hidden">
                            <div className="py-2">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(lead.id, option.value);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-md text-white hover:bg-gray-700 flex items-center transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  disabled={isLoading}
                                >
                                  {option.icon}
                                  <span className={`font-medium ${option.labelColor}`}>{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </InnerCard>

        {/* Pagination Controls */}
        {filteredLeads.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeads.length)} of {filteredLeads.length} leads
            </div>
            
            <div className="flex items-center gap-2">
              <button
              onClick={goToPreviousPage}
                disabled={frontendPage === 1}
                className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalFrontendPages }, (_, i) => i + 1).map(pageNumber => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalFrontendPages ||
                    (pageNumber >= frontendPage - 1 && pageNumber <= frontendPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          frontendPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === frontendPage - 2 ||
                    pageNumber === frontendPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={frontendPage === totalFrontendPages && !hasMoreBackendData}
                className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </MainCard>

      {/* Phone Modal */}
      <PhoneModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contactInfo={selectedStudent?.contactInformation || []}
        studentName={selectedStudent?.name || ''}
      />

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        student={selectedStudentDetails}
      />
    </div>
  );
};

export default LeadManagerTable;