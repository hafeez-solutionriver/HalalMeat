import React, { useContext, useEffect } from 'react';
import { View, Button,Image,StyleSheet,Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen'; // Your Login Screen
import ViewStockWorkerScreen from './screens/ViewStockWorkerScreen';
import UpdateStockWorkerScreen from './screens/UpdateStockWorkerScreen';
import ReorderWorkerScreen from './screens/ReorderWorkerScreen';
import { RoleProvider, RoleContext } from './context/RoleContext'; // Your Role Context
import { scale,verticalScale } from 'react-native-size-matters';
const Drawer = createDrawerNavigator();


function WorkerScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Worker's Dashboard" />
    </View>
  );
}

function SuperUserScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Super User's Dashboard" />
    </View>
  );
}

function SupervisorScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Supervisor's Dashboard" />
    </View>
  );
}
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Image 
          source={require('./assets/worker.png')} // Replace with your image
          style={styles.profileImage}
        />
        <Text style={styles.profileTitle}>John Doe</Text>
        <Text style={styles.profileSubtitle}>johndoe@example.com</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
// Drawer items based on roles
const RoleBasedDrawer = () => {
  const { role } = useContext(RoleContext); // Get the current role

  return (
    <Drawer.Navigator initialRouteName="Login" drawerContent={(props) => <CustomDrawerContent {...props} />}  screenOptions={{headerShown:role!=null?true:false,drawerLabelStyle:{right:scale(20)}}}>
      {/* Conditionally render screens based on the role */}
      {role === 'Worker' && <Drawer.Screen name="View Stock Worker" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/view_record.png')}
              style={{ width: size, height: size }}
            />)}} component={ViewStockWorkerScreen} />}
      {role === 'Worker' && <Drawer.Screen name="Update Stock Worker" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/update_stock.png')}
              style={{ width: size, height: size }}
            />)}} component={UpdateStockWorkerScreen} />}
      {role === 'Worker' && <Drawer.Screen name="Reorder Stock Worker" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/reorder.png')}
              style={{ width: size, height: size }}
            />)}} component={ReorderWorkerScreen} />}
      {role === 'Super User' && <Drawer.Screen name="Super User" component={SuperUserScreen} />}
      {role === 'Supervisor' && <Drawer.Screen name="Supervisor" component={SupervisorScreen} />}
      {role===null && <Drawer.Screen name="Login" component={LoginScreen} />}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom:scale(10)
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make the image circular
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  drawerLabel: {
    marginLeft: -15, // Adjust this value to reduce space between the icon and the label
  },
});
export default function App() {
  return (
    <RoleProvider>
      <PaperProvider>
        <NavigationContainer>
          <RoleBasedDrawer />
        </NavigationContainer>
      </PaperProvider>
    </RoleProvider>
  );
}
