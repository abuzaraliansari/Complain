// filepath: /c:/workspace/admin/userComplain/contexts/FormDataContext.js
import React, { createContext, useState } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  const updateFormData = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};