import React from 'react';

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{student.studentName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Board" value={student.board} />
              <InfoItem label="Grade" value={student.grade} />
              <InfoItem label="School" value={student.school} />
              <InfoItem label="Branch" value={student.branch} />
              <InfoItem label="Academic Year" value={student.academicYear} />
              <InfoItem label="Date of Birth" value={formatDate(student.dateOfBirth)} />
              <InfoItem label="Gender" value={student.gender} />
              <InfoItem label="Status" value={student.status} />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Information
            </h3>
            {student.contactInformation && student.contactInformation.length > 0 ? (
              <div className="space-y-3">
                {student.contactInformation.map((contact, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoItem label="Name" value={contact.relationName} />
                      <InfoItem label="Relation" value={contact.relation} />
                      <InfoItem label="Phone" value={contact.number} />
                      <InfoItem label="Email" value={contact.email} />
                      <InfoItem label="Education" value={contact.educationQualification} />
                      <InfoItem label="Organization" value={contact.nameOfOrganisation} />
                      <InfoItem label="Designation" value={contact.designation} />
                      <InfoItem label="Department" value={contact.Department} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No contact information available</p>
            )}
          </div>

          {/* Address */}
          {student.address && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Address
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Area" value={student.address.area} />
                  <InfoItem label="Landmark" value={student.address.landmark} />
                  <InfoItem label="City" value={student.address.city} />
                  <InfoItem label="State" value={student.address.state} />
                  <InfoItem label="Pincode" value={student.address.pincode} />
                </div>
              </div>
            </div>
          )}

          {/* Sales Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Sales & Lead Information
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem label="Sales Status" value={student.salesStatus} />
                <InfoItem label="Source" value={student.source} />
                <InfoItem label="Inquiry Date" value={formatDate(student.inquiryDate)} />
                <InfoItem label="Assigned To" value={student.assignTo?.name || '-'} />
                <InfoItem label="Last Update" value={student.lastUpdate} />
              </div>
            </div>
          </div>

          {/* Subjects */}
          {student.subjects && student.subjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Subjects
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {student.subjects.map((subject, index) => {
                    const subjectName = typeof subject === 'string' ? subject : (subject.name || subject.subjectName || '-');
                    return (
                      <span key={index} className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm border border-indigo-700">
                        {subjectName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Fee Configuration */}
          {student.feeConfig && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Fee Configuration
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Base Price" value={student.feeConfig.basePrice ? `₹${student.feeConfig.basePrice}` : '-'} />
                  <InfoItem label="GST Applied" value={student.feeConfig.gstApplied ? 'Yes' : 'No'} />
                  <InfoItem label="GST Amount" value={student.feeConfig.gstAmount ? `₹${student.feeConfig.gstAmount}` : '-'} />
                  <InfoItem label="Scholarship Applied" value={student.feeConfig.scholarshipApplied ? 'Yes' : 'No'} />
                  <InfoItem label="Scholarship Amount" value={student.feeConfig.scholarshipAmount ? `₹${student.feeConfig.scholarshipAmount}` : '-'} />
                  <InfoItem label="Total Amount" value={student.feeConfig.totalAmount ? `₹${student.feeConfig.totalAmount}` : '-'} />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {student.notes && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Notes
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-300 whitespace-pre-wrap">{student.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-white capitalize">{value || '-'}</p>
  </div>
);

export default StudentDetailsModal;
