import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button,RadioButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { getDatabase, ref, update, push, get, query, orderByChild, equalTo } from 'firebase/database'; // Firebase functions
import StaticMethods from '../utils/OfflineStorage';

const UpdateWorkerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { isEdit, item } = route.params || {};

  // State variables to hold input values
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');
  const [shop,setShop] = useState('Hounslow');

  useEffect(() => {
    if (isEdit && item) {
      // Populate fields when editing an existing worker
      setWorkerName(item.name);
      setWorkerEmail(item.email.toLowerCase());
      setWorkerPassword(item.password);
      setShop(item.shop);
    } else {
      // Clear fields when adding a new worker
      setWorkerName('');
      setWorkerEmail('');
      setWorkerPassword('');
      setShop('Hounslow');
    }
  }, [isEdit, item]);

  const handleSubmit = async () => {
    const db = getDatabase();
    const workersRef = ref(db, 'Worker');

    if (!workerName || !workerEmail || !workerPassword ||!shop) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    else if(!StaticMethods.isValidEmail(workerEmail.toLowerCase()))
    {
      Alert.alert('Error', 'Invalid email address format!.');
      return;
    }
    else if(!StaticMethods.isValidPassword(workerPassword))
      {
        Alert.alert('Error', 'Password should have at least length of 8.');
        return;
      }
    

    if (isEdit) {
      // Check if email exists (excluding the current worker being edited)
      try {
        const emailQuery = query(workersRef, orderByChild('email'), equalTo(workerEmail.toLowerCase()));
        const snapshot = await get(emailQuery);

        // Filter out the current worker's data from the snapshot
        const isEmailTaken = snapshot.exists() && Object.keys(snapshot.val()).some(key => key !== item.id);

        if (isEmailTaken) {
          Alert.alert('Error', 'Email address already exists.');
          return;
        } else {
          // Proceed to update the worker
          const workerRef = ref(db, `Worker/${item.id}`);
          await update(workerRef, {
            name: workerName,
            email: workerEmail.toLowerCase(),
            password: workerPassword,
            shop:shop
          }).then(() => {
            Alert.alert('Success', 'Employee updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
          });
        }
      } catch (error) {
        console.log('Error checking email during update:', error);
        Alert.alert('Error', 'There was an error updating the employee. Please try again.');
      }
    } else {
      // Add new worker logic with email validation
      try {
        // Query the database to check if the email already exists
        const emailQuery = query(workersRef, orderByChild('email'), equalTo(workerEmail));
        const snapshot = await get(emailQuery);

        if (snapshot.exists()) {
          // Email already exists
          Alert.alert('Error', 'Email address already exists.');
        } else {
          // Add the new worker if email doesn't exist
          const newWorkerRef = push(workersRef); // Generate a new unique ID
          await update(newWorkerRef, {
            name: workerName,
            email: workerEmail.toLowerCase(),
            password: workerPassword,
            shop:shop
          }).then(() => {
            Alert.alert('Success', 'New Employee added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
          });
        }
      } catch (error) {
        console.log('Error checking email during creation:', error);
        Alert.alert('Error', 'There was an error adding the employee. Please try again.');
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{isEdit ? 'Edit Employee' : 'Add Worker'}</Text>

      <TextInput
        label="Employee Name"
        value={workerName}
        onChangeText={setWorkerName}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />

      <TextInput
        label="Employee Email"
        value={workerEmail}
        onChangeText={setWorkerEmail}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />
      <TextInput
        label="Employee Password"
        value={workerPassword}
        onChangeText={setWorkerPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />
      {/* Shops Radio Button */}
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Shop</Text>
        <RadioButton.Group onValueChange={setShop} value={shop}>
        <View style={styles.radioButtonRow}>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Hounslow" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Hounslow</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="South hall" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>South hall</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Hayes" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Hayes</Text>
          </View>

          </View>
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        {isEdit ? 'Update' : 'Add'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: 'rgb(250,250,250)',
    justifyContent: 'center',
  },
  heading: {
    fontSize: scale(30),
    textAlign: 'center',
    marginBottom: verticalScale(16),
    fontFamily: 'Ubuntu_700Bold',
  },
  input: {
    width: '100%',
    marginBottom: verticalScale(16),
    backgroundColor: 'white',
  },
  radioLabel: {
    fontSize: scale(16),
    marginStart: moderateScale(5),
    marginBottom: verticalScale(8),
    fontFamily: 'Ubuntu_400Regular',
  },
  radioButtonRow: {
    flexDirection: 'row', // Make the radio buttons align horizontally
    flexWrap: 'wrap', // Wrap to the next row if there are more items
     // Space the items evenly
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    width: '30%', // Adjust the width for two items per row
  },
  radioButtonLabel: {
    fontSize: scale(14),
    fontFamily: 'Ubuntu_400Regular',
  },
  submitButton: {
    width: '100%',
    height: verticalScale(50),
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
  },
  submitButtonText: {
    fontSize: scale(18),
    fontFamily: 'Ubuntu_700Bold',
  },
});

export default UpdateWorkerScreen;
