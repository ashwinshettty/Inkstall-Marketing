import React, { useState, useEffect } from "react";
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as MailIcon,
  LocationOn as MapPinIcon,
  CalendarToday as CalendarIcon,
  MenuBook as BookOpenIcon,
} from '@mui/icons-material';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);

  // Fetch enquiries from API
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        console.log('Fetching data from:', `${apiUrl}/api/enquiries/enquiry-form`);
        const response = await axios.get(`${apiUrl}/api/enquiries/enquiry-form`);
        
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        console.log('Response status:', response.status);
        console.log('Response data type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));
        console.log('Response data:', response.data);
        
        if (Array.isArray(response.data)) {
          console.log('Number of enquiries:', response.data.length);
          if (response.data.length > 0) {
            console.log('First enquiry object:', response.data[0]);
            console.log('First enquiry keys:', Object.keys(response.data[0]));
            console.log('First enquiry contact:', response.data[0].contact);
          }
        } else if (response.data && typeof response.data === 'object') {
          console.log('Response is an object with keys:', Object.keys(response.data));
        }
        
        const enquiryData = Array.isArray(response.data) ? response.data : [];
        setEnquiries(enquiryData);
        setFilteredEnquiries(enquiryData);
        setError(null);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
        setError('Failed to load enquiries. Please try again later.');
        // Fallback to sample data if API fails (for demo purposes)
        const sampleData = [{
          _id: '1',
          name: "Vanshika N",
          grade: "9",
          board: "CBSE",
          address: "Villa 86 Godrej Gold County, Chikkabidarakallu, tumkur road, Bengaluru -560073",
          contact: {
            name: "Janani N (Mother)",
            phone: "919986071749"
          },
          date: "11/24/2025",
          subjects: [
            { name: "Mathematics", score: 36, total: 50, percentage: 72 },
            { name: "Physics", score: 48, total: 70, percentage: 68.57 },
            { name: "Chemistry", score: 52, total: 70, percentage: 74.29 }
          ],
          helpNeeded: "We need help in understanding the concepts.",
          source: "enquiry-form"
        }];
        setEnquiries(sampleData);
        setFilteredEnquiries(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  useEffect(() => {
    // Filter enquiries based on search query
    const filtered = enquiries.filter(enquiry => {
      if (!enquiry) return false;
      const query = searchQuery.toLowerCase();
      const contact = enquiry.contactInformation?.[0] || {};
      
      return (
        (enquiry.fullName && enquiry.fullName.toLowerCase().includes(query)) ||
        (contact.phone && contact.phone.includes(searchQuery)) ||
        (contact.mobile && contact.mobile.includes(searchQuery)) ||
        (contact.email && contact.email.toLowerCase().includes(query)) ||
        (enquiry.enquiryDate && enquiry.enquiryDate.toLowerCase().includes(query)) ||
        (enquiry.notes && enquiry.notes.toLowerCase().includes(query))
      );
    });
    setFilteredEnquiries(filtered);
  }, [searchQuery, enquiries]);

  // Function to format phone number
  const formatPhoneNumber = (phone) => {
    // Format phone number as +91 XXXXXXXXXX
    return `+91 ${phone}`;
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Safely get contact information
  const getContactInfo = (contactInfo) => {
    if (!contactInfo || !contactInfo.length) return { name: 'Contact', phone: 'Not provided' };
    
    // Get the first contact information entry
    const primaryContact = contactInfo[0];
    return {
      name: primaryContact.name || primaryContact.fullName || 'Contact',
      phone: primaryContact.phone || primaryContact.mobile || 'Not provided',
      email: primaryContact.email || 'Not provided'
    };
  };

  // Format contact display
  const formatContactDisplay = (enquiry) => {
    const contact = getContactInfo(enquiry.contactInformation);
    if (contact.name === 'Contact' && contact.phone === 'Not provided') {
      return 'Contact information not available';
    }
    return `${contact.name}: ${formatPhoneNumber(contact.phone)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CircularProgress className="text-blue-500 mb-4" />
        <span>Loading enquiries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Enquiries ({filteredEnquiries.length})</h2>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or notes"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
        {filteredEnquiries.map((enquiry) => (
          <div key={enquiry.id} className="bg-white rounded-xl shadow-md p-6 relative">
            {/* Enquiry Tag */}
            <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {enquiry.source === 'enquiry-form' ? 'Enquiry' : 'Subject'}
            </span>

            {/* Name and Basic Info */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                {enquiry.fullName || 
                (enquiry.contactInformation?.[0]?.name ? `${enquiry.contactInformation[0].name}'s Enquiry` : 'New Enquiry')}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1 space-x-4">
                {enquiry.grade && <span>Grade: {enquiry.grade}</span>}
                {enquiry.grade && enquiry.board && <span>•</span>}
                {enquiry.board && <span>Board: {enquiry.board}</span>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <span className="text-gray-700">Address: {enquiry.address || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {formatContactDisplay(enquiry)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Enquiry Date: {formatDate(enquiry.enquiryDate || enquiry.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Source: {enquiry.source || 'N/A'}</span>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Subjects:</h4>
              <div className="flex flex-wrap gap-2">
                {enquiry.subjects?.length > 0 ? (
                  enquiry.subjects.map((subject, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {subject.name}: {subject.score}/{subject.total} ({subject.percentage}%)
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No subjects specified</span>
                )}
              </div>
            </div>

            {/* Help Needed */}
            {enquiry.helpNeeded && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Help Needed:</span> {enquiry.helpNeeded}
                </p>
              </div>
            )}
          </div>
        ))}

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No enquiries found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries;
