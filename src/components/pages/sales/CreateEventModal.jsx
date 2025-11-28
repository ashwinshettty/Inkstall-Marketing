import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const CreateEventModal = ({ isOpen, onClose, onSuccess, editData = null, initialDate = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: initialDate || '',
    time: '',
    priority: 'medium',
    status: 'pending',
    urgency: 'later',
    studentName: '',
    contactNumber: '',
    contactName: '',
    contactType: 'Phone',
    location: '',
    description: '',
    createdBy: '',
  });

  const [additionalContacts, setAdditionalContacts] = useState([]);
  const [counsellors, setCounsellors] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const dropdownRef = useRef(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [isContactInputFocused, setIsContactInputFocused] = useState(false);
  const contactDropdownRef = useRef(null);

  // Fetch students with admission due status
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      fetchCounsellors();
    }
  }, [isOpen, editData, initialDate]);

  // Format time from any format to 'HH:MM' for input[type='time']
  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return '';
    
    try {
      // If already in HH:MM format (24-hour)
      if (timeStr.match(/^\d{2}:\d{2}$/)) {
        return timeStr;
      }
      
      // If in HH:MM:SS format (24-hour)
      if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return timeStr.substring(0, 5);
      }
      
      // If in HH:MM AM/PM format
      if (timeStr.match(/\d{1,2}:\d{2}\s*[AP]M$/i)) {
        const [timePart, period] = timeStr.split(' ');
        let [hours, minutes] = timePart.split(':');
        
        hours = parseInt(hours, 10);
        if (period.toLowerCase() === 'pm' && hours < 12) hours += 12;
        if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
      
      // If it's a full ISO date string or other format
      const date = new Date(`2000-01-01T${timeStr}`);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    } catch (e) {
      console.error('Error formatting time for input:', e);
    }
    
    return '';
  };

  // Populate form when editing
  useEffect(() => {
    if (editData && isOpen) {
      console.log('Edit data received:', JSON.stringify(editData, null, 2));
      
      // Format the time for the time input
      const formattedTime = formatTimeForInput(editData.time);
      console.log('Formatted time for input:', formattedTime);
      
      // Set form data
      setFormData({
        title: editData.title || '',
        type: editData.type || '',
        date: editData.date ? editData.date.split('T')[0] : '',
        time: formattedTime,
        priority: editData.priority || 'medium',
        status: editData.status || 'pending',
        urgency: editData.urgency || 'later',
        studentName: editData.studentName || '',
        contactNumber: editData.contacts?.[0]?.number || '',
        contactName: editData.contacts?.[0]?.name || '',
        contactType: editData.contacts?.[0]?.type || 'Phone',
        location: editData.location || '',
        description: editData.description || '',
        createdBy: editData.createdBy || '',
      });

      // Set search terms for display
      setSearchTerm(editData.studentName || '');
      setContactSearchTerm(editData.contacts?.[0]?.number || '');

      // Set additional contacts if more than one
      if (editData.contacts && editData.contacts.length > 1) {
        const additionalContactsData = editData.contacts.slice(1).map(contact => ({
          number: contact.number || '',
          name: contact.name || '',
          type: contact.type || 'Phone',
          searchTerm: contact.number || '',
          showDropdown: false,
          isInputFocused: false
        }));
        setAdditionalContacts(additionalContactsData);
      }

      // If we have studentId, find and set the selected student
      if (editData.studentId) {
        // We'll need to wait for students to be fetched first
        const findStudent = () => {
          const student = students.find(s => s._id === editData.studentId);
          if (student) {
            setSelectedStudent(student);
            setContactNumbers(student.contactInformation || []);
            setFilteredContacts(student.contactInformation || []);
          }
        };
        
        if (students.length > 0) {
          findStudent();
        }
      }
    }
  }, [editData, isOpen, students]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsInputFocused(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setShowContactDropdown(false);
        setIsContactInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens with initialDate if provided
      setFormData(prev => ({
        ...prev,
        title: '',
        type: '',
        date: initialDate || '',
        time: '',
        priority: 'medium',
        status: 'pending',
        urgency: 'later',
        studentName: '',
      }));
    }
  }, [isOpen, initialDate]);

  const fetchCounsellors = async () => {
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

      // Get unique counsellors
      const uniqueCounsellors = [...new Set(allFetchedLeads.map(lead => lead.counsellor).filter(c => c && c !== '' && c !== '-'))];
      setCounsellors(uniqueCounsellors);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
    }
  };

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const authToken = localStorage.getItem('authToken');
      let allStudents = [];
      let page = 1;
      let hasMorePages = true;

      // Fetch all pages until we get all students
      while (hasMorePages) {
        const { data } = await api.get(`/api/leads?page=${page}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (data.success && data.students) {
          allStudents = [...allStudents, ...data.students];

          // Check if there are more pages
          const totalPages = data.pagination?.totalPages || 1;
          hasMorePages = page < totalPages;
          page++;
        } else {
          hasMorePages = false;
        }
      }

      setStudents(allStudents);
      setFilteredStudents(allStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    // Filter students based on student name
    const filtered = students.filter(student => {
      const studentName = student.studentName?.toLowerCase() || '';
      const searchLower = value.toLowerCase();
      
      return studentName.includes(searchLower);
    });
    setFilteredStudents(filtered);
  };

  const handleStudentSelect = (student) => {
    const studentName = student.studentName || '';
    
    setSearchTerm(studentName);
    setSelectedStudent(student);
    setContactNumbers(student.contactInformation || []);
    setFilteredContacts(student.contactInformation || []);
    setFormData(prev => ({
      ...prev,
      studentName: studentName,
      contactNumber: '',
      contactName: '',
    }));
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedStudent(null);
    setContactNumbers([]);
    setFilteredContacts([]);
    setContactSearchTerm('');
    setFormData(prev => ({
      ...prev,
      studentName: '',
      contactNumber: '',
      contactName: '',
    }));
    setFilteredStudents(students);
    setShowDropdown(false);
  };

  const handleContactSearch = (e) => {
    const value = e.target.value;
    setContactSearchTerm(value);
    setShowContactDropdown(true);

    // Filter contacts based on phone number
    const filtered = contactNumbers.filter(contact => {
      const number = contact.number?.toLowerCase() || '';
      const searchLower = value.toLowerCase();
      return number.includes(searchLower);
    });
    setFilteredContacts(filtered);
  };

  const handleContactSelect = (contact) => {
    const phone = contact.number || '';
    const relationName = contact.relationName || '';
    const relation = contact.relation || '';
    const contactName = relationName || relation || '';
    
    setContactSearchTerm(phone);
    setFormData(prev => ({
      ...prev,
      contactNumber: phone,
      contactName: contactName,
    }));
    setShowContactDropdown(false);
  };

  const handleAdditionalContactSelect = (contact, index) => {
    const phone = contact.number || '';
    const relationName = contact.relationName || '';
    const relation = contact.relation || '';
    const contactName = relationName || relation || '';
    
    const updatedContacts = [...additionalContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      number: phone,
      name: contactName,
      searchTerm: phone,
      showDropdown: false
    };
    setAdditionalContacts(updatedContacts);
  };

  const addAnotherContact = () => {
    setAdditionalContacts([...additionalContacts, {
      number: '',
      name: '',
      type: 'Phone',
      searchTerm: '',
      showDropdown: false,
      isInputFocused: false
    }]);
  };

  const removeAdditionalContact = (index) => {
    const updatedContacts = additionalContacts.filter((_, i) => i !== index);
    setAdditionalContacts(updatedContacts);
  };

  const handleAdditionalContactSearch = (e, index) => {
    const value = e.target.value;
    const updatedContacts = [...additionalContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      searchTerm: value,
      showDropdown: true
    };
    setAdditionalContacts(updatedContacts);
  };

  const handleAdditionalContactChange = (field, value, index) => {
    const updatedContacts = [...additionalContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setAdditionalContacts(updatedContacts);
  };

  const handleClearAdditionalContact = (index) => {
    const updatedContacts = [...additionalContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      number: '',
      name: '',
      searchTerm: '',
      showDropdown: false
    };
    setAdditionalContacts(updatedContacts);
  };

  const handleClearContact = () => {
    setContactSearchTerm('');
    setFormData(prev => ({
      ...prev,
      contactNumber: '',
      contactName: '',
    }));
    setFilteredContacts(contactNumbers);
    setShowContactDropdown(false);
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    setContactSearchTerm(value);
    
    // If contact number is cleared, also clear contact name
    if (!value) {
      setFormData(prev => ({
        ...prev,
        contactNumber: '',
        contactName: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.type || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Format date to YYYY-MM-DD
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        // If it's already in YYYY-MM-DD format, return as is
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateString;
        }
        
        // Try parsing as ISO date string
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.error('Invalid date string:', dateString);
          return '';
        }
        
        // Format as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        console.error('Error formatting date:', e);
        return '';
      }
    };

    // Format time to HH:MM:SS AM/PM
    const formatTime = (timeString) => {
      if (!timeString) return '';
      
      try {
        // If already in HH:MM:SS AM/PM format
        if (timeString.match(/\d{1,2}:\d{2}(?::\d{2})?\s*[AP]M$/i)) {
          return timeString;
        }
        
        // If in HH:MM format (24-hour)
        const match24 = timeString.match(/^(\d{1,2}):(\d{2})$/);
        if (match24) {
          let hours = parseInt(match24[1], 10);
          const minutes = match24[2];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours || 12; // Convert 0 to 12 for 12-hour format
          return `${hours}:${minutes} ${ampm}`;
        }
        
        // For any other format, try to parse as Date
        const date = new Date(`2000-01-01T${timeString}`);
        if (!isNaN(date.getTime())) {
          let hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours || 12; // Convert 0 to 12 for 12-hour format
          return `${hours}:${minutes} ${ampm}`;
        }
      } catch (e) {
        console.error('Error formatting time:', e);
      }
      
      return timeString; // Return as is if we can't parse it
    };

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem('authToken');
      
      let data;
      
      if (editData) {
        // Use updateActionStatus endpoint for editing
        const allContacts = [];
        
        // Always include the primary contact if number exists
        if (formData.contactNumber) {
          allContacts.push({
            name: formData.contactName || 'Primary Contact',
            number: formData.contactNumber,
            type: formData.contactType || 'Phone',
            _id: editData.contacts?.[0]?._id // Preserve existing ID if available
          });
        }
        
        // Add additional contacts
        additionalContacts.forEach((contact, index) => {
          if (contact.number) {
            allContacts.push({
              name: contact.name || `Contact ${index + 2}`,
              number: contact.number,
              type: contact.type || 'Phone',
              _id: editData.contacts?.[index + 1]?._id // Preserve existing IDs
            });
          }
        });

        // Format date and time
        const formattedDate = formatDate(formData.date);
        const formattedTime = formatTime(formData.time);
        
        // Update existing sales action
        const updatePayload = {
          status: formData.status || 'pending',
          title: formData.title || '',
          studentName: formData.studentName || '',
          phone: formData.contactNumber || '',
          priority: formData.priority || 'medium',
          type: formData.type || '',
          counsellor: formData.createdBy || '',
          date: formattedDate,
          time: formattedTime,
          urgency: formData.urgency || 'later',
          studentId: selectedStudent?._id || editData.studentId || null,
          contacts: allContacts,
          location: formData.location || '',
          description: formData.description || '',
        };  
        
        // Ensure we're sending all fields explicitly
        const payloadToSend = {
          ...updatePayload,
          // Force include date and time even if empty
          date: updatePayload.date || null,
          time: updatePayload.time || null,
        };
        
        console.log('Sending update payload:', JSON.stringify(payloadToSend, null, 2));
        
        const response = await api.patch(`/api/sales/actions/${editData._id}`, payloadToSend, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        data = response.data;
      } else {
        // Use createSales endpoint for creating new
        const allContacts = [];
        if (formData.contactNumber) {
          allContacts.push({
            name: formData.contactName,
            number: formData.contactNumber,
            type: formData.contactType
          });
        }
        additionalContacts.forEach(contact => {
          if (contact.number) {
            allContacts.push({
              name: contact.name,
              number: contact.number,
              type: contact.type
            });
          }
        });

        const createPayload = {
          leadId: formData.studentName || 'temp-lead-id',
          title: formData.title,
          type: formData.type,
          date: formData.date,
          time: formData.time,
          priority: formData.priority,
          status: formData.status,
          urgency: formData.urgency,
          studentName: formData.studentName,
          studentId: selectedStudent?._id || null,
          contacts: allContacts,
          location: formData.location,
          description: formData.description,
          createdBy: formData.createdBy
        };

        const response = await api.post('/api/sales', createPayload, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        data = response.data;
      }

      if (data.success) {
        toast.success(editData ? 'Sales action updated successfully!' : 'Sales action created successfully!');
        onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating sales action:', error);
      toast.error(error.response?.data?.message || 'Failed to create sales action');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: '',
      date: '',
      time: '',
      priority: 'medium',
      status: 'pending',
      urgency: 'later',
      studentName: '',
      contactNumber: '',
      contactName: '',
      contactType: 'Phone',
      location: '',
      description: '',
    });
    setSearchTerm('');
    setShowDropdown(false);
    setIsInputFocused(false);
    setSelectedStudent(null);
    setContactNumbers([]);
    setFilteredContacts([]);
    setContactSearchTerm('');
    setShowContactDropdown(false);
    setIsContactInputFocused(false);
    setAdditionalContacts([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{editData ? 'Edit Action Item' : 'Create Action Item'}</h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title and Event Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Event Type</option>
                <option value="upcoming">Upcoming</option>
                <option value="calls">Calls</option>
                <option value="branch visit">Branch Visit</option>
                <option value="meeting">Meeting</option>
                <option value="demo lecture">Demo Lecture</option>
                <option value="counselling">Counselling</option>
                <option value="payments">Payments</option>
                <option value="reviews">Reviews</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* Priority, Status, Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="soon">Soon</option>
                <option value="later">Later</option>
                <option value="schedule">Schedule</option>
              </select>
            </div>
          </div>

          {/* Student Name and Counsellor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-400 mb-1">Student Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleStudentSearch}
                  onFocus={() => {
                    setShowDropdown(true);
                    setIsInputFocused(true);
                  }}
                  onBlur={() => {
                    // Delay to allow click on clear button
                    setTimeout(() => setIsInputFocused(false), 200);
                  }}
                  className="w-full px-3 py-2 pr-10 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {isLoadingStudents && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                  {!isLoadingStudents && isInputFocused && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 22 22" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {showDropdown && filteredStudents.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => handleStudentSelect(student)}
                        className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 last:border-b-0"
                      >
                        <div className="font-medium">{student.studentName}</div>
                      </div>
                    ))}
                  </div>
                )}
                {showDropdown && filteredStudents.length === 0 && !isLoadingStudents && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                    <div className="px-3 py-2 text-gray-400 text-sm">No students found</div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Counsellor</label>
              <select
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Counsellor</option>
                {counsellors.map((counsellor, index) => (
                  <option key={index} value={counsellor}>
                    {counsellor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Number, Contact Name, Contact Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative" ref={contactDropdownRef}>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={contactSearchTerm}
                  onChange={(e) => {
                    handleContactSearch(e);
                    handleContactNumberChange(e);
                  }}
                  onFocus={() => {
                    if (selectedStudent) {
                      setShowContactDropdown(true);
                      setIsContactInputFocused(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsContactInputFocused(false), 200);
                  }}
                  disabled={!selectedStudent}
                  className="w-full px-3 py-2 pr-10 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {!isLoadingStudents && isContactInputFocused && selectedStudent && (
                    <button
                      type="button"
                      onClick={handleClearContact}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 22 22" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {showContactDropdown && filteredContacts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredContacts.map((contact, index) => (
                      <div
                        key={index}
                        onClick={() => handleContactSelect(contact)}
                        className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 last:border-b-0"
                      >
                        <div className="font-medium">
                          {contact.number}
                          {(contact.relationName || contact.relation) && (
                            <span className="text-gray-400 text-sm ml-2">({contact.relationName || contact.relation})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showContactDropdown && filteredContacts.length === 0 && selectedStudent && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                    <div className="px-3 py-2 text-gray-400 text-sm">No contacts found</div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                disabled={!formData.contactNumber}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Type</label>
              <select
                name="contactType"
                value={formData.contactType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Phone">Phone</option>
                <option value="In-person">In Person</option>
                <option value="Video">Video</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          {/* Additional Contacts */}
          {additionalContacts.map((contact, index) => (
            <div key={index} className="border border-gray-600 rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">Additional Contact {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeAdditionalContact(index)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Additional Contact Number */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contact Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={contact.searchTerm}
                      onChange={(e) => {
                        handleAdditionalContactSearch(e, index);
                        const value = e.target.value;
                        if (!value) {
                          handleClearAdditionalContact(index);
                        }
                      }}
                      onFocus={() => {
                        if (selectedStudent) {
                          const updatedContacts = [...additionalContacts];
                          updatedContacts[index] = {
                            ...updatedContacts[index],
                            showDropdown: true,
                            isInputFocused: true
                          };
                          setAdditionalContacts(updatedContacts);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          const updatedContacts = [...additionalContacts];
                          updatedContacts[index] = {
                            ...updatedContacts[index],
                            isInputFocused: false
                          };
                          setAdditionalContacts(updatedContacts);
                        }, 200);
                      }}
                      disabled={!selectedStudent}
                      className="w-full px-3 py-2 pr-10 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {contact.isInputFocused && selectedStudent && (
                        <button
                          type="button"
                          onClick={() => handleClearAdditionalContact(index)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 22 22" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {contact.showDropdown && filteredContacts.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredContacts.filter(c => {
                          const searchLower = contact.searchTerm.toLowerCase();
                          return c.number?.toLowerCase().includes(searchLower);
                        }).map((c, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleAdditionalContactSelect(c, index)}
                            className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 last:border-b-0"
                          >
                            <div className="font-medium">
                              {c.number}
                              {(c.relationName || c.relation) && (
                                <span className="text-gray-400 text-sm ml-2">({c.relationName || c.relation})</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleAdditionalContactChange('name', e.target.value, index)}
                    disabled={!contact.number}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Additional Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Contact Type</label>
                <select
                  value={contact.type}
                  onChange={(e) => handleAdditionalContactChange('type', e.target.value, index)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Phone">Phone</option>
                  <option value="In-person">In Person</option>
                  <option value="Video">Video</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>
          ))}

          {/* Add Another Contact Button */}
          {formData.contactNumber && contactNumbers.length > 1 && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={addAnotherContact}
                className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                + Add Another Number
              </button>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
