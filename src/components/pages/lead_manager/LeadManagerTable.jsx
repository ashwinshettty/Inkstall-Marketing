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
  const [totalLeads, setTotalLeads] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
        const mappedLeads = response.data.students?.map(student => ({
          id: student._id,
          name: student.studentName || '-',
          board: student.board || '-',
          grade: student.grade || '-',
          source: student.source || '-',
          status: student.status === 'admissiondue' ? 'Admission Due' : '-',
          salesStatus: student.salesStatus || '-',
          counsellor: student.assignTo?.name || '-',
          lastUpdate: formatDate(student.updatedAt || student.createdAt),
          phone: student.contactInformation?.[0]?.number || '',
          contactInformation: student.contactInformation || []
        })) || [];

        setAllLeads(prev => pageToFetch === 1 ? mappedLeads : [...prev, ...mappedLeads]);
        
        // Safely access pagination with fallbacks
        const total = response.data.pagination?.total || 0;
        const totalPages = response.data.pagination?.totalPages || 1;
        
        setTotalLeads(total);
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
    const statusMatch = selectedStatus === 'all' || lead.salesStatus.toLowerCase() === selectedStatus.toLowerCase();
    const counsellorMatch = selectedCounsellor === 'all' || lead.counsellor === selectedCounsellor;
    const nameMatch = searchName === '' || lead.name.toLowerCase().includes(searchName.toLowerCase());
    return boardMatch && statusMatch && counsellorMatch && nameMatch;
  });

  // Frontend Pagination calculations
  const totalFrontendPages = Math.ceil(filteredLeads.length / FRONTEND_PAGE_SIZE);
  const indexOfLastItem = frontendPage * FRONTEND_PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - FRONTEND_PAGE_SIZE;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters change
  useEffect(() => {
    setFrontendPage(1);
  }, [selectedBoard, selectedStatus, selectedCounsellor, searchName]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="demo">Demo</option>
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
        <div className="grid grid-cols-8 gap-4 px-4 py-3 border-b border-gray-700">
          <div className="text-xs text-gray-400 font-medium">Name</div>
          <div className="text-xs text-gray-400 font-medium">Board</div>
          <div className="text-xs text-gray-400 font-medium">Grade</div>
          <div className="text-xs text-gray-400 font-medium">Source</div>
          <div className="text-xs text-gray-400 font-medium">Status</div>
          <div className="text-xs text-gray-400 font-medium">Counsellor</div>
          <div className="text-xs text-gray-400 font-medium">Last Update</div>
          <div className="text-xs text-gray-400 font-medium">Actions</div>
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
                  className="grid grid-cols-8 gap-4 px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer" 
                  onClick={() => handleRowClick(lead)}
                >
                  <div className="text-white">{lead.name}</div>
                  <div className="text-gray-300">{lead.board}</div>
                  <div className="text-gray-300">{lead.grade}</div>
                  <div className="text-gray-300">{lead.source}</div>
                  <div className="text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === 'Admission Due' 
                        ? 'bg-yellow-900 text-yellow-300' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="text-gray-300">{lead.counsellor}</div>
                  <div className="text-gray-300">{lead.lastUpdate}</div>
                  <div className="text-gray-300">
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeads.length)} of {filteredLeads.length} leads (Total: {totalLeads})
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