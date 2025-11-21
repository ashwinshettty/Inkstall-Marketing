import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext.jsx';

const ProfilePage = () => {
  const { logout } = useAppContext();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const name = localStorage.getItem('name') || '';
    const role = localStorage.getItem('role') || '';
    const photoUrl = localStorage.getItem('profilePhotoUrl') || '';
    
    setUserName(name);
    setUserRole(role);
    setProfilePhotoUrl(photoUrl);
  }, []);

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-8 bg-slate-800 rounded-lg max-w-2xl mx-auto mt-8">
      <div className="flex flex-col items-center">
        {profilePhotoUrl ? (
          <img 
            src={profilePhotoUrl} 
            alt={userName}
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-4xl text-slate-900 mb-4">
            {getInitials(userName)}
          </div>
        )}
        <h2 className="text-2xl font-bold text-white mb-2">{userName}</h2>
        <p className="text-gray-400 mb-6">{userRole}</p>
      </div>
      <div className="bg-slate-700 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Bio</h3>
        <p className="text-gray-300 leading-relaxed">
          Experienced Super Admin with a passion for managing and optimizing system operations.
          Dedicated to ensuring smooth workflows and maintaining high standards of security and performance.
        </p>
      </div>
      <div className="bg-slate-700 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
        <div className="space-y-2">
          <p className="text-gray-300">
            <span className="font-semibold">Email:</span> ashwin.admin@inkstall.com
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Location:</span> Mumbai, India
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;