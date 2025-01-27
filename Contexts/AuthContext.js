import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};