import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainCard from '../../ui/MainCard';
import SalesCard from './SalesCard';
import { 
  FaClipboardList, 
  FaCalendarAlt, 
  FaPhone, 
  FaBuilding, 
  FaUsers, 
  FaGraduationCap, 
  FaComments, 
  FaDollarSign, 
  FaStar, 
  FaEllipsisH 
} from 'react-icons/fa';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const SalesFilter = () => {
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [allLeads, setAllLeads] = useState([]);

  // Fetch all leads to get counsellors
  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        let allFetchedLeads = [];
        let currentPage = 1;
        let hasMore = true;

        // Fetch all pages
        while (hasMore) {
          const { data } = await api.get('/api/leads', {
            params: { page: currentPage },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (data.success && data.students.length > 0) {
            const mappedLeads = data.students.map(student => ({
              counsellor: student.assignTo?.name || '-',
            }));
            allFetchedLeads = [...allFetchedLeads, ...mappedLeads];
            
            // Check if there are more pages
            hasMore = currentPage < data.pagination.totalPages;
            currentPage++;
          } else {
            hasMore = false;
          }
        }

        setAllLeads(allFetchedLeads);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };

    fetchAllLeads();
  }, []);

  // Get unique counsellors for filter dropdown
  const uniqueCounsellors = ['all', ...new Set(allLeads.map(lead => lead.counsellor).filter(c => c && c !== '' && c !== '-'))];

  const eventTypes = [
    { id: 'all', label: 'All Events', icon: FaClipboardList },
    { id: 'upcoming', label: 'Upcoming', icon: FaCalendarAlt },
    { id: 'calls', label: 'Calls', icon: FaPhone },
    { id: 'branch visit', label: 'Branch Visits', icon: FaBuilding },
    { id: 'meeting', label: 'Meetings', icon: FaUsers },
    { id: 'demo lecture', label: 'Demo Lectures', icon: FaGraduationCap },
    { id: 'counselling', label: 'Counselling', icon: FaComments },
    { id: 'payments', label: 'Payments', icon: FaDollarSign },
    { id: 'reviews', label: 'Reviews', icon: FaStar },
    { id: 'other', label: 'Other', icon: FaEllipsisH },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Sales Actions Calendar</h2>
          <p className="text-gray-400 mt-1">Manage and track all sales activities and events.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          + Create Event
        </button>
      </div>

      <MainCard>
        {/* Event Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 max-w-full">
            {eventTypes.map((event) => (
            <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                selectedEvent === event.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600'
                }`}
            >
                <event.icon className="text-sm" />
                <span className="text-md">{event.label}</span>
            </button>
            ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-end">
            {/* Priority Filter */}
            <div className="relative">
            <label className="text-xs text-gray-400 block mb-1">Priority</label>
            <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 appearance-none cursor-pointer"
            >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <div className="absolute right-3 top-9 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 appearance-none cursor-pointer"
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute right-3 top-9 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            </div>

            {/* Agent Filter */}
            <div className="relative">
            <label className="text-xs text-gray-400 block mb-1">Counsellor</label>
            <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 appearance-none cursor-pointer"
            >
                {uniqueCounsellors.map((counsellor, index) => (
                <option key={index} value={counsellor}>
                    {counsellor === 'all' ? 'All Counsellors' : counsellor || 'Unassigned'}
                </option>
                ))}
            </select>
            <div className="absolute right-3 top-9 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            </div>

            {/* Search Input and View Toggle Buttons */}
            <div className="flex-1 flex items-end gap-3">
            <div className="flex-1 min-w-[250px]">
                <label className="text-xs text-gray-400 block mb-1">Search</label>
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-400"
                />
                <div className="absolute left-3 top-2.5">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                </div>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex gap-2">
            <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600'
                }`}
            >
                List View
            </button>
            <button
                onClick={() => setViewMode('calendar')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600'
                }`}
            >
                Calendar
            </button>
            </div>
            </div>
        </div>

        {/* Sales Cards */}
        <SalesCard 
          filters={{
            event: selectedEvent,
            priority: selectedPriority,
            status: selectedStatus,
            counsellor: selectedAgent,
            search: searchQuery
          }}
        />
      </MainCard>

    </div>
  );
};

export default SalesFilter;