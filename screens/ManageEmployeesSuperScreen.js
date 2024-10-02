import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getDatabase, ref,remove,onValue } from 'firebase/database'; // Firebase Realtime Database import

const fetchEmployees = async (setEmployees) => {
  const dbRef = ref(getDatabase(), 'Worker');
  
    // Fetch data from 'Worker' node
    await onValue(dbRef, (snapshot)=>{
    if (snapshot.exists()) {
      const users = snapshot.val();
      const employeeList = Object.keys(users).map((userId) => ({
        id: userId,
        ...users[userId],
      }));
      setEmployees(employeeList);
    } else {
      console.log("No data available");
      setEmployees([]);}
    });
  
  } 
  
const ManageEmployeesSuperScreen = ({navigation}) => {
  let isEdit;
  // Mock data for employees
  const [employees, setEmployees] = useState([]);
  useEffect(()=>{
    fetchEmployees(setEmployees);
  },[])
  // Handle edit employee
  const handleEdit = (item) => {
    isEdit=true;
    navigation.navigate('UpdateEmployee', { isEdit,item });
  };

  const removeFromDatabase = async(id)=>{

     const taskRef = ref(getDatabase(), `Worker/${id}`);
     await remove(taskRef).then(()=>setEmployees(prev => prev.filter(emp => emp.id !== id))).catch((reason)=>console.log(reason));

  }
  // Handle delete employee
  const handleDelete = (item) => {
    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => removeFromDatabase(item.id)}
      ]
    );
  };

  // Handle add employee
  const handleAddEmployee = () => {
    isEdit=false;
    navigation.navigate('UpdateEmployee',{isEdit});
  };

  // Render each employee as a card
  const renderEmployee = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeEmail}>{item.email}</Text>
      </Card.Content>
      <Card.Actions >
        <Button style={{width:'48%'}} onPress={() => handleEdit(item)} labelStyle={{fontFamily:'Ubuntu_700Bold'}}>Edit</Button>
        <Button style={{width:'50%'}} onPress={() => handleDelete(item)} labelStyle={{fontFamily:'Ubuntu_700Bold'}}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Add Employee Button */}
      <Button mode="contained" onPress={handleAddEmployee} style={styles.addButton} labelStyle={{ fontFamily:'Ubuntu_700Bold',fontSize:moderateScale(15)}}>
        Add Employee
      </Button>

      {/* Employee List */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployee}
      />
    </View>
  );
};

export default ManageEmployeesSuperScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: 'rgb(250,250,250)',
  },
  addButton: {
    marginBottom: verticalScale(16),
    backgroundColor: '#03A9F4',
  },
  card: {
    marginBottom: verticalScale(12),
    backgroundColor: 'white',
    borderColor:'#fff',
    borderRadius:moderateScale(10),
  },
  employeeName: {
    fontSize: scale(18),
    fontWeight: 'bold',
    fontFamily:'Ubuntu_700Bold'
  },
  employeeEmail: {
    fontSize: scale(14),
    color: 'grey',
    fontFamily:'Ubuntu_400Regular'
  },
});
