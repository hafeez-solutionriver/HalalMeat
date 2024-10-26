import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet, Text, StatusBar, Alert } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import {  NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen'; // Your Login Screen
import ViewStockWorkerScreen from './screens/ViewStockWorkerScreen';
import { RoleProvider, RoleContext } from './context/RoleContext'; // Your Role Context
import UpdateWorkerScreen from './screens/UpdateWorkerScreen';
import { scale } from 'react-native-size-matters';
import CoverPage from './screens/CoverScreen';
import ManageProductsSuperScreen from './screens/ManageProductsSuperScreen';
import ManageEmployeesSuperScreen from './screens/ManageEmployeesSuperScreen';
import GenerateReportSupervisorScreen from './screens/GenerateReportSupervisorScreen';
import * as SplashScreen from 'expo-splash-screen'; // Import SplashScreen API
import { useFonts, Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import AddProductScreen from './screens/AddProductScreen';
import StaticMethods from './utils/OfflineStorage';
import ViewStockSupervisorScreen from './screens/ViewStockSupervisorScreen';
import resetStock from './utils/ResetStock';
import { stopListening } from './utils/UserInfoChange';
import { getDatabase, ref, set, update } from 'firebase/database'; // Firebase Realtime Database import

SplashScreen.preventAutoHideAsync(); // Prevents the splash screen from auto-hiding

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { role, userEmail, userName,userShop } = useContext(RoleContext); // Get the current role

  let headerIcon;
  if (role === 'Worker') {
    headerIcon = require('./assets/worker.png');
  } else if (role === 'Super User') {
    headerIcon = require('./assets/superuser.png');
  } else if (role === 'Supervisor') {
    headerIcon = require('./assets/supervisor.png');
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image source={headerIcon} style={styles.profileImage} />
       {role==="Worker" && <Text style={styles.profileTitle}>{userShop} Shop</Text>}
        <Text style={styles.profileTitle}>{userName}</Text>
        <Text style={styles.profileSubtitle}>{userEmail}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Drawer items based on roles
const RoleBasedDrawer = () => {
  const { role, isLoggedIn,setIsLoggedIn,userShop,userName,hasSubmittedStock } = useContext(RoleContext); // Get the current role
  const [initialRouteName, setInitialRouteName] = useState(''); // Add a loading state

  const updateSubmittedBy = () => {
   
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const timeFormatted = formatter.format(new Date());
    
    // Separate time and period (AM/PM)
    const [time] = timeFormatted.split(" ");
    const dbRef = ref(getDatabase(), `shops/${userShop}/submittedBy`);
    // Construct newSubmittedBy with separated AM/PM
    console.log('time check ',`${userName}_${time.split(' ')[0]}}`)
    const newSubmittedBy = `${userName}_${time.split(' ')[0]}`;
    
    // Update the submittedBy field
    set(dbRef, newSubmittedBy)
      .then(() => {
        Alert.alert('Stock Update', 'Stock update sent to Supervisor Successfully');
      })
      .catch((error) => {
        Alert.alert('Error Stock Update', error.message);
      });
 
};
  
  useEffect(() => {

    setInitialRouteName(
      !isLoggedIn
        ? 'Cover'
        : role.trim() === 'Worker'
        ? 'View Stock Worker'
        : role.trim() === 'Super User'
        ? 'Manage Employees'
        : role.trim() === 'Supervisor'
        ? 'View Stock'
        : 'Cover'
    );
  }, [isLoggedIn, role]);

 
  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerLabelStyle: { right: scale(20) },
        headerStyle: { backgroundColor: '#03A9F1' },
        headerTintColor: '#fff',
      }}
    >
      {!isLoggedIn && <Drawer.Screen name="Cover" component={CoverPage} options={{ headerShown: false }} />}
      
      {role === 'Worker' && (
        <Drawer.Screen
          name="View Stock Worker"
          options={{
            title: 'View Stock',
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/viewstock.png')} style={{ width: size, height: size }} />
            ),
          }}
          component={ViewStockWorkerScreen}
        />
      )}
      {role === 'Worker' && (
        <Drawer.Screen
          name="Submit"
          options={{
            title: 'Submit Stock',
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/submit.png')} style={{ width: size, height: size }} />
            ),
          }}
          listeners={({navigation}) => ({
            drawerItemPress: (e) => {
              e.preventDefault();
              navigation.closeDrawer();
              if(!hasSubmittedStock){
              const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
  
    // Check if the current time is less than 5:00 PM
    if (currentHours < 17 || (currentHours === 17 && currentMinutes === 0)) {
      Alert.alert('Stock Submission to Supervisor', 'Are you sure you want to Submit stock?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            updateSubmittedBy();
          },
        },
      ]);
    } else {
      Alert.alert(
        'Submission is not Allowed!',
        'You cannot perform this action after 5:00 PM.',
        [{ text: 'OK' }]
      );
    }}
    else
    {
      Alert.alert(
        'Update Does not Allowed!',
        'Stock udpated has already submitted to supervisor',
        [{ text: 'OK' }]
      );
    }
             
            },
          })}
          component={View}
        />
      )}
      
      {role === 'Super User' && (
        <Drawer.Screen
          name="Manage Employees"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/manageemployees.png')} style={{ width: size, height: size }} />
            ),
          }}
          component={ManageEmployeesSuperScreen}
        />
      )}
      {/* 
      Adding three shops View Products Screens...
      */}
      {role === 'Super User' && (
        <Drawer.Screen
          name="Hounslow Shop Products"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/shops.png')} style={{ width: size, height: size }} />
            ),title:"1.Hounslow Shop"
          }}
          component={ManageProductsSuperScreen}
          initialParams={{shop:"Hounslow"}}
        />
      )}
      {role === 'Super User' && (
        <Drawer.Screen
          name="South hall Shop"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/shops.png')} style={{ width: size, height: size }} />
            ),title:"2.South hall Shop"
          }}
          component={ManageProductsSuperScreen}
          initialParams={{shop:"South hall"}}
        />
      )}
      {role === 'Super User' && (
        <Drawer.Screen
          name="Hayes Shop Products"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/shops.png')} style={{ width: size, height: size }} />
            ),title:"3.Hayes Shop"
          }}
          component={ManageProductsSuperScreen}
          initialParams={{shop:"Hayes"}}

        />
      )}

      {/* {role === 'Supervisor' && (
        <Drawer.Screen
          name="View Stock"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/viewstock.png')} style={{ width: size, height: size }} />
            ),
          }}
          component={ViewStockSupervisorScreen}
        />
      )} */}
      {/* Adding 3 shops products page to supervisor role */}
      {role === 'Supervisor' && (
        <Drawer.Screen
          name="Generate Report"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/generatereport.png')} style={{ width: size, height: size }} />
            ),
          }}
          component={GenerateReportSupervisorScreen}
        />
      )}
      {role === 'Supervisor' && (
        <Drawer.Screen
          name="Hounslow Shop Products"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/shops.png')} style={{ width: size, height: size }} />
            ),title:"1.Hounslow Shop"
          }}
          component={ViewStockSupervisorScreen}
          initialParams={{shop:"Hounslow"}}
        />
      )}
      {role === 'Supervisor' && (
        <Drawer.Screen
          name="South hall Shop"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/shops.png')} style={{ width: size, height: size }} />
            ),title:"2.South hall Shop"
          }}
          component={ViewStockSupervisorScreen}
          initialParams={{shop:"South hall"}}
        />
      )}
      {role === 'Supervisor' && (
        <Drawer.Screen
          name="Hayes Shop Products"
          options={{
            drawerIcon: ({ color, size }) => (
              <Image source={require('./assets/shops.png')} style={{ width: size, height: size }} />
            ),title:"3.Hayes Shop"
          }}
          component={ViewStockSupervisorScreen}
          initialParams={{shop:"Hayes"}}

        />
      )}
      
      
      {!isLoggedIn && <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />}
      
      <Drawer.Screen
        name="UpdateEmployee"
        component={UpdateWorkerScreen}
        options={{
          headerShown: false,
          drawerItemStyle: { display: 'none' }, // Hide this from the drawer
        }}
      />
      
      <Drawer.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          headerShown: false,
          drawerItemStyle: { display: 'none' }, // Hide this from the drawer
        }}
      />

      {isLoggedIn && (
        <Drawer.Screen name="Logout" options={{
          drawerIcon: ({ size }) => (
            <Image source={require('./assets/logout.png')} style={{ width: size, height: size }} />
          ),
          title: 'Logout',
        }} listeners={({navigation}) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.closeDrawer();
            Alert.alert('Log out', 'Are you sure you want to Log out?', [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'YES',
                onPress: async() => {
                  stopListening();
                  
                  await StaticMethods.clearData().then(()=>{setIsLoggedIn(false);navigation.navigate('Cover')})
                  ;
                },
              },
            ]);
          },
        })} component={View} />
      )}
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

useEffect(()=>{
  // console.log('reset stock is calling in app useEffect')
resetStock();
},[])

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
        <StatusBar backgroundColor="#03A9F1" />
        <NavigationContainer onLayoutRootView={onLayoutRootView}>
          <RoleBasedDrawer />
        </NavigationContainer>
      </PaperProvider>
    </RoleProvider>
  );
}
