import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const value = {
    currentPage,
    handleNavigation,
    setCurrentPage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
