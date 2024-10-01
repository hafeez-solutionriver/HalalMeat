import React, { useContext, useEffect,useState,useCallback } from 'react';
import { View,Image,StyleSheet,Text,StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen'; // Your Login Screen
import ViewStockWorkerScreen from './screens/ViewStockWorkerScreen';
import UpdateStockWorkerScreen from './screens/UpdateStockWorkerScreen';
import { RoleProvider, RoleContext } from './context/RoleContext'; // Your Role Context
import { scale } from 'react-native-size-matters';
import CoverPage from './screens/CoverScreen';
import ManageProductsSuperScreen from './screens/ManageProductsSuperScreen';
import ManageEmployeesSuperScreen from './screens/ManageEmployeesSuperScreen';
import ViewStockSupervisorScreen from './screens/ViewStockSupervisorScreen';
import GenerateReportSupervisorScreen from './screens/GenerateReportSupervisorScreen'
import * as SplashScreen from 'expo-splash-screen';  // Import SplashScreen API
import { useFonts, Ubuntu_400Regular,Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import UpdateWorkerScreen from './screens/UpdateWorkerScreen';
SplashScreen.preventAutoHideAsync(); // Prevents the splash screen from auto-hiding

const Drawer = createDrawerNavigator();


function CustomDrawerContent(props) {
  const { role } = useContext(RoleContext); // Get the current role

  let headerIcon;
  if (role === 'Worker') {
   headerIcon=require('./assets/worker.png')
  } else if (role === 'Super User') {
   headerIcon=require('./assets/superuser.png')
  } else if (role === 'Supervisor') {
    headerIcon=require('./assets/supervisor.png')
  }
  return (
    <DrawerContentScrollView {...props}>
     
      <View style={styles.drawerHeader}>
        <Image 
          source={headerIcon} // Replace with your image
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
  const { role,isLoggedIn } = useContext(RoleContext); // Get the current role
 
  let initialRouteName = 'Cover'; // Default to Login if not logged in
  if (isLoggedIn) {
    if (role === 'Worker') {
      initialRouteName = 'View Stock Worker';
    } else if (role === 'Super User') {
      initialRouteName = 'Manage Employees';
    } else if (role === 'Supervisor') {
      initialRouteName = 'View Stock';
    }
  }
  return (
    <Drawer.Navigator initialRouteName={initialRouteName}  drawerContent={(props) => <CustomDrawerContent {...props} />}  screenOptions={{drawerLabelStyle:{right:scale(20)},headerStyle:{backgroundColor:'#03A9F1'},headerTintColor:'#fff'}}>
   {!isLoggedIn && <Drawer.Screen name="Cover" component={CoverPage} options={{headerShown:false}}/>}
      {/* Conditionally render screens based on the role */}
      {role === 'Worker' && <Drawer.Screen name="View Stock Worker" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/viewstock.png')}
              style={{ width: size, height: size }}
            />)}} component={ViewStockWorkerScreen} />}
      {role === 'Worker' && <Drawer.Screen name="Update Stock Worker" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/updatestock.png')}
              style={{ width: size, height: size }}
            />)}} component={UpdateStockWorkerScreen} />}
      
      {role === 'Super User' && <Drawer.Screen name="Manage Employees" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/manageemployees.png')}
              style={{ width: size, height: size }}
            />)}} component={ManageEmployeesSuperScreen} />}
      {role === 'Super User' && <Drawer.Screen name="Manage Product" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/manageproduct.png')}
              style={{ width: size, height: size }}
            />)}}
            component={ManageProductsSuperScreen} />}
      {role === 'Supervisor' && <Drawer.Screen name="View Stock" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/viewstock.png')}
              style={{ width: size, height: size }}
            />)}}
             component={ViewStockSupervisorScreen} />}
      {role === 'Supervisor' && <Drawer.Screen name="Generate Report" options={{drawerIcon: ({ color, size }) => (
              <Image
              source={require('./assets/generatereport.png')}
              style={{ width: size, height: size }}
            />)}}
            component={GenerateReportSupervisorScreen} />}

    {(!isLoggedIn) && <Drawer.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />}
    <Drawer.Screen
        name="UpdateEmployee"
        component={UpdateWorkerScreen}
        options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} // Hide this from the drawer
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor:'#03A9F1',
    marginBottom:scale(10)
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 10, // Make the image circular
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffff',
    fontFamily:'Ubuntu_700Bold'
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#ffff',
    fontFamily:'Ubuntu_400Regular'
  },
  
});
export default function App() {

  const [appIsReady, setAppIsReady] = useState(false); // State to track readiness of the app
 // Load fonts using @expo-google-fonts/ubuntu
 const [fontsLoaded] = useFonts({
  Ubuntu_400Regular,
  Ubuntu_700Bold  // Load the Ubuntu font
});

useEffect(() => {
  if (fontsLoaded) {
    setAppIsReady(true); // Set app as ready when fonts are loaded
    SplashScreen.hideAsync(); // Hide the splash screen once the app is ready
  }
}, [fontsLoaded]);

// Callback to prevent the splash screen from hiding before the app is ready
const onLayoutRootView = useCallback(async () => {
  if (appIsReady) {
    await SplashScreen.hideAsync(); // Hide the splash screen when the app is ready
  }
}, [appIsReady]);

if (!appIsReady) {
  return null;  // Render nothing until the app is ready
}
  return (
    <RoleProvider>
      <PaperProvider>
        <StatusBar backgroundColor="#03A9F1" barStyle="light-content"/>
        <NavigationContainer onLayoutRootView={onLayoutRootView}>
          <RoleBasedDrawer />
        </NavigationContainer>
      </PaperProvider>
    </RoleProvider>
  );
}
