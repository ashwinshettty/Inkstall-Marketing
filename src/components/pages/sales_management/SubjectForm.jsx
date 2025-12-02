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
import MainCard from '../../ui/MainCard';

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // Fetch subject forms from API
  useEffect(() => {
    const fetchSubjectForms = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        console.log('Fetching subject forms from:', `${apiUrl}/api/enquiries/subject-form`);
        
        const response = await axios.get(`${apiUrl}/api/enquiries/subject-form`);
        console.log('Subject forms response:', response.data);
        
        setSubjects(response.data);
        setFilteredSubjects(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subject forms:', err);
        setError('Failed to load subject forms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectForms();
  }, []);

  // Filter subjects based on search query
  useEffect(() => {
    const filtered = subjects.filter(subject => {
      if (!subject) return false;
      const query = searchQuery.toLowerCase();
      const contact = subject.contactInformation?.[0] || {};
      
      return (
        (subject.fullName && subject.fullName.toLowerCase().includes(query)) ||
        (contact.phone && contact.phone.includes(searchQuery)) ||
        (contact.mobile && contact.mobile.includes(searchQuery)) ||
        (contact.email && contact.email.toLowerCase().includes(query)) ||
        (subject.enquiryDate && subject.enquiryDate.toLowerCase().includes(query)) ||
        (subject.notes && subject.notes.toLowerCase().includes(query))
      );
    });
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects]);

  // Format phone number
  const formatPhoneNumber = (phone) => {
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
    
    const primaryContact = contactInfo[0];
    return {
      name: primaryContact.name || primaryContact.fullName || 'Contact',
      phone: primaryContact.phone || primaryContact.mobile || 'Not provided',
      email: primaryContact.email || 'Not provided'
    };
  };

  // Format contact display
  const formatContactDisplay = (subject) => {
    const contact = getContactInfo(subject.contactInformation);
    if (contact.name === 'Contact' && contact.phone === 'Not provided') {
      return 'Contact information not available';
    }
    return `${contact.name}: ${formatPhoneNumber(contact.phone)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CircularProgress className="text-blue-500 mb-4" />
        <span>Loading subject forms...</span>
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
    <div className="p-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subject Forms ({filteredSubjects.length})</h2>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or notes"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-85 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Subject Forms List */}
      <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
        {filteredSubjects.map((subject) => (
          <MainCard key={subject._id}>
            {/* Form Tag */}
            <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Subject Form
            </span>

            {/* Name and Basic Info */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                {subject.fullName || 
                (subject.contactInformation?.[0]?.name ? `${subject.contactInformation[0].name}'s Form` : 'New Subject Form')}
              </h3>
              <div className="flex items-center text-white text-sm mt-1 space-x-4">
                {subject.grade && <span>Grade: {subject.grade}</span>}
                {subject.grade && subject.board && <span>•</span>}
                {subject.board && <span>Board: {subject.board}</span>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <span className="text-white">Address: {subject.address || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <span className="text-white">
                  {formatContactDisplay(subject)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <span className="text-white">Form Submitted: {formatDate(subject.enquiryDate || subject.createdAt)}</span>
              </div>
              {subject.source && (
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-white">Source: {subject.source}</span>
                </div>
              )}
            </div>

            {/* Subject Entries */}
            {subject.subjectEntries?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-white mb-2">Subject Details:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subject.subjectEntries.map((entry, idx) => (
                    <div key={idx} className="bg-gray-600 p-3 rounded-lg">
                      <div className="font-medium text-white">{entry.subjectName || 'Subject'}</div>
                      {entry.score !== undefined && (
                        <div className="text-sm text-white">
                          Score: {entry.score} {entry.totalScore && `/ ${entry.totalScore}`}
                        </div>
                      )}
                      {entry.notes && (
                        <div className="text-sm text-white mt-1">Notes: {entry.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {subject.notes && (
              <div className="bg-gray-600 p-3 rounded-lg">
                <p className="text-sm text-white">
                  <span className="font-medium">Additional Notes:</span> {subject.notes}
                </p>
              </div>
            )}
          </MainCard>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="text-center py-10 text-white">
            {searchQuery 
              ? 'No subject forms match your search.'
              : 'No subject forms available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectForm;