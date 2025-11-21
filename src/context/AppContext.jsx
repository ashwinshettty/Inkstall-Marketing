import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Check localStorage first to determine initial page
  const getInitialPage = () => {
    const storedToken = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('name');
    return (storedToken && storedName) ? 'dashboard' : 'login';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Restore user session on mount if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    const storedProfilePhotoUrl = localStorage.getItem('profilePhotoUrl');

    if (storedToken && storedName) {
      setAuthToken(storedToken);
      setUser({
        name: storedName,
        role: storedRole,
        profilePhotoUrl: storedProfilePhotoUrl
      });
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const logout = () => {
    // Clear all localStorage
    localStorage.clear();
    setAuthToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  const value = {
    currentPage,
    handleNavigation,
    setCurrentPage,
    user,
    setUser,
    authToken,
    setAuthToken,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
