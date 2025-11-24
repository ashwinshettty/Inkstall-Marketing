import React, { useState } from 'react';

const PhoneModal = ({ isOpen, onClose, contactInfo, studentName }) => {
  const [selectedNumber, setSelectedNumber] = useState('');

  if (!isOpen) return null;

  const handleCall = () => {
    if (selectedNumber) {
      window.open(`tel:${selectedNumber}`, '_self');
      setSelectedNumber('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 bg-opacity-50" onClick={handleClose}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Contact Information</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Student Name */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">Student</p>
          <p className="text-lg text-white font-medium">{studentName}</p>
        </div>

        {/* Contact List */}
        <div className="space-y-3 mb-6">
          {contactInfo && contactInfo.length > 0 ? (
            contactInfo.map((contact, index) => (
              <div
                key={index}
                onClick={() => setSelectedNumber(contact.number)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedNumber === contact.number
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium">{contact.relationName || 'N/A'}</p>
                    <p className="text-sm text-gray-400 capitalize">{contact.relation || 'N/A'}</p>
                    <p className="text-blue-400 mt-1">{contact.number || 'N/A'}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedNumber === contact.number
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-500'
                  }`}>
                    {selectedNumber === contact.number && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400">
              No contact information available
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCall}
            disabled={!selectedNumber}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
              selectedNumber
                ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;
