import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { getDatabase, ref, update, push } from 'firebase/database'; // Firebase functions

const UpdateWorkerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { isEdit, item } = route.params || {};

  // State variables to hold input values
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');

  useEffect(() => {
    if (isEdit && item) {
      // Populate fields when editing an existing worker
      setWorkerName(item.name);
      setWorkerEmail(item.email);
      setWorkerPassword(item.password);
    } else {
      // Clear fields when adding a new worker
      setWorkerName('');
      setWorkerEmail('');
      setWorkerPassword('');
    }
  }, [isEdit, item]);

  const handleSubmit = async () => {
    const db = getDatabase();
    const workersRef = ref(db, 'Worker');

    if (!workerName || !workerEmail || !workerPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (isEdit) {
      // Edit existing worker logic
      const workerRef = ref(db, `Worker/${item.id}`);
      await update(workerRef, {
        name: workerName,
        email: workerEmail,
        password: workerPassword,
      }).then(()=>{
        Alert.alert('Success', 'Employee updated successfully!',[{text: 'OK', onPress: () => navigation.goBack()}]);
      });
     
    } else {
      // Add new worker logic
      const newWorkerRef = push(workersRef); // Generate a new unique ID
      await update(newWorkerRef, {
        name: workerName,
        email: workerEmail,
        password: workerPassword,
      }).then(()=>{
        Alert.alert('Success', 'New Employee Added successfully!',[{text: 'OK', onPress: () => navigation.goBack()}]);
      });
     
    }

    // Go back to the previous screen after the operation
    
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

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        {isEdit ? 'Edit' : 'Add'}
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
