import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [categoryID, setCategoryID] = useState(null);

  console.log('AuthContext categoryID:', categoryID);
  console.log(userDetails);

  if (userDetails) {
    console.log('AuthContext userDetails:', userDetails);
    console.log('AuthContext roles:', userDetails.roles);
  }

  return (
    <AuthContext.Provider value={{
      authToken, setAuthToken,
      userDetails, setUserDetails,
      categoryID, setCategoryID
    }}>
      {children}
    </AuthContext.Provider>
  );
};