import React, { createContext, useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import StaticMethods from '../utils/OfflineStorage'; // Using the updated StaticMethods

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userShop, setUserShop] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for async data
  // This will ensure hooks are called consistently on every render
  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const data = await StaticMethods.getStoredData(); // Fetch the stored object from AsyncStorage
     
        if (data) {
          setIsLoggedIn(data.isLoggedIn || false); // Set isLoggedIn from stored data
          setRole(data.role || ''); // Set role from stored data
          setUserEmail(data.userEmail || '');
          setUserName(data.userName || '');
          setUserShop(data.userShop ||'')
        
        }
      } catch (error) {
        console.error('Error getting stored data:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchLoginStatus(); // Async function to fetch stored data
  }, []); // Empty dependency array ensures this is only run once on mount


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        setIsLoggedIn,
        userEmail,
        setUserEmail,
        userName,
        setUserName,
        userPassword,
        setUserPassword,
        userShop,
        setUserShop
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
