// RoleContext.js
import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  
  return (
    <RoleContext.Provider value={{ role, setRole,isLoggedIn,setIsLoggedIn }}>
      {children}
    </RoleContext.Provider>
  );
};
