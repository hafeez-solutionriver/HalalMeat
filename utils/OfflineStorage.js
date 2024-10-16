import AsyncStorage from '@react-native-async-storage/async-storage';

// The data object structure should be:
// data = {"isLoggedIn": true/false, "userEmail": "email", "role": "role", "userName": "name"}

class StaticMethods {
  
  // Method to get the entire stored data object
  static getStoredData = async () => {
    try {
      const value = await AsyncStorage.getItem('data');
      if (value !== null) {
        return JSON.parse(value); // Parse and return the stored data
      } else {
        return {}; // Return an empty object if there's no data
      }
    } catch (e) {
      console.error('Error fetching stored data:', e);
      return {}; // Return an empty object if there's an error
    }
  };

  // Method to store the entire data object
  static storeData = async (value) => {
    try {
      await AsyncStorage.setItem('data', JSON.stringify(value));
    } catch (e) {
      console.error('Error storing data:', e);
    }
  };

  static clearData = async () => {
    
    try {
        const data = {
            isLoggedIn: null,
            userEmail:null,
            role: null,
            userName: null,
            userId:null,
            userPassword:null
          };
      await AsyncStorage.setItem('data', JSON.stringify(data));
    } catch (e) {
      console.error('Error storing data:', e);
    }
  };

  // Method to update a single property in the stored data
  static updateStoredData = async (key, value) => {
    try {
      const currentData = await StaticMethods.getStoredData(); // Get the current stored data
      const updatedData = { ...currentData, [key]: value }; // Update the specific field
      await StaticMethods.storeData(updatedData); // Store the updated data object back to AsyncStorage
    } catch (e) {
      console.error('Error updating stored data:', e);
    }
  };

  // Email validation method
  static isValidEmail = email => {
    const mailFormat =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return mailFormat.test(email);
  };

  // Password validation method
  static isValidPassword = password => {
    return password.length >= 8;
  };
}

export default StaticMethods;
