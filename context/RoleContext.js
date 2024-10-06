// RoleContext.js
import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [userEmail,setUserEmail] = useState('');
  const [userName,setUserName] = useState('');
  
  return (
    <RoleContext.Provider value={{ role, setRole,isLoggedIn,setIsLoggedIn,userEmail,setUserEmail,userName,setUserName }}>
      {children}
    </RoleContext.Provider>
  );
};
