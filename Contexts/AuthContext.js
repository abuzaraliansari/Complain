import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [categoryID, setCategoryID] = useState(null);

  console.log('AuthContext categoryID:', categoryID);

  if (userDetails) {
    console.log('AuthContext isAdmin:', userDetails.isAdmin);
  }

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, userDetails, setUserDetails, categoryID, setCategoryID }}>
      {children}
    </AuthContext.Provider>
  );
};