import AsyncStorage from "@react-native-async-storage/async-storage";

// Store item (convert boolean to string)
export const InsertItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value)); // Stringify value
  } catch (error) {
    console.log(error);
  }
};

// Retrieve item (parse string to boolean if necessary)
export const GetItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null; // Parse value back to its original type
  } catch (error) {
    console.log(error);
  }
};
