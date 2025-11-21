import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import TopbarSearch from './TopbarSearch';
import NewCampaign from './NewCampaign';

const Topbar = ({ title }) => {
  const { handleNavigation } = useAppContext();
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

  return (
    <div className="bg-slate-900 text-white p-2 flex items-center justify-between border-b border-slate-700">
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-2">{title}</h1>
        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded-full">
          Inkstall HQ - Mumbai
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TopbarSearch />
        <NewCampaign />
        <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('profile')}>
          <div className="mr-2 text-right">
            <p className="font-semibold text-xs">{userName}</p>
            <p className="text-[10px] text-gray-400">{userRole}</p>
          </div>
          {profilePhotoUrl ? (
            <img 
              src={profilePhotoUrl} 
              alt={userName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="bg-yellow-500 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
              {getInitials(userName)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
