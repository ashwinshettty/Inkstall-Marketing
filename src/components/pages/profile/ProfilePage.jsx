import React from 'react';
import { useAppContext } from '../../../context/AppContext.jsx';

const ProfilePage = () => {
  const { setCurrentPage } = useAppContext();

  const handleLogout = () => {
    setCurrentPage('login');
  };

  return (
    <div className="p-8 bg-slate-800 rounded-lg max-w-2xl mx-auto mt-8">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-4xl text-slate-900 mb-4">
          AS
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ashwin (Admin)</h2>
        <p className="text-gray-400 mb-6">Super Admin</p>
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