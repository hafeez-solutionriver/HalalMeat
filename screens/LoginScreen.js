import React, { useState,useContext,useEffect } from 'react';
import { View, StyleSheet, Image, Alert,BackHandler } from 'react-native';
import { TextInput, Button, Menu } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { getDatabase, ref, child, get } from 'firebase/database';  // Firebase Realtime Database
import { initializeApp, getApps } from 'firebase/app';
import { RoleContext } from '../context/RoleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InsertItem } from '../utils/OfflineStorage';
const firebaseConfig = {
  apiKey: "AIzaSyD2a7gjEbl5aw0RjA-i4uTFNDgWsIm71x8",
  authDomain: "halal-meat-19aff.firebaseapp.com",  // Typically derived from project_id
  projectId: "halal-meat-19aff",
  storageBucket: "halal-meat-19aff.appspot.com",
  messagingSenderId: "765038496812",  // Derived from project_number
  appId: "1:765038496812:android:7bf87975e775cf80c85589",
  measurementId: "" // Optional, leave blank if not using analytics
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the already initialized app
}
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { role,setIsLoggedIn,isLoggedIn } = useContext(RoleContext);
  // Firebase Realtime Database reference
  const dbRef = ref(getDatabase(app));
  // /BackHandler.exitApp() will exit the app
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () =>navigation.goBack()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
 
  const handleLogin = async () => {
    setIsLoggedIn(prev=>!prev);
    
    if(role=='Worker')
    {
      navigation.navigate('View Stock Worker');
    }
    else if(role=='Super User')
    {
      navigation.navigate('Manage Employees');
    }
    else{
      navigation.navigate('View Stock');

    }
  //   if(email!='' && password!='')
  //   {

  //   try {
  //     // Fetch users from Firebase Realtime Database
  //     const snapshot = await get(child(dbRef, role));
  //     if (snapshot.exists()) {
  //       const users = snapshot.val();
  //       let userFound = false;

  //       // Iterate through the users to validate email and password
  //       for (let userId in users) {
  //         const user = users[userId];
  //         if (user.email === email && user.password === password) {
           
  //           userFound = true;
  //     // Navigate based on role
  //     setIsLoggedIn(prev=>!prev);
    
  //     if(role=='Worker')
  //     {
  //       navigation.navigate('View Stock Worker');
  //     }
  //     else if(role=='Super User')
  //     {
  //       navigation.navigate('Manage Employees');
  //     }
  //     else{
  //       navigation.navigate('View Stock');

  //     }
  //           break;
  //         }
  //       }

  //       if (!userFound) {
  //         Alert.alert('Login Failed', 'Invalid email or password.');
  //       }
  //     } else {
  //       Alert.alert('Error', 'No users found in the database.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert('Error', 'Something went wrong while fetching user data.');
  //   }
  // }
  // else
  // {
  //   Alert.alert('Error', 'Kindly fill the fields');
  // }
  };

  return (
    <View style={styles.container}>
      {/* App Icon */}
      <Image
        source={require('../assets/ic_login.png')}
        style={styles.loginIcon}
      />

      {/* Email Field */}
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={text => setEmail(text)}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }} // Customize border color and text color

      />

      {/* Password Field */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }} // Customize border color and text color
      />
      {/* Login Button */}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        labelStyle={styles.loginButtonText}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgb(250,250,250)'
  },
  loginIcon: {
    width: scale(150),
    height: verticalScale(150),
    marginBottom: verticalScale(32),
  },
  input: {
    width: '100%',
    marginBottom: verticalScale(16),
    backgroundColor: 'white',
  },
  
  loginButton: {
    width: '100%',
    height: verticalScale(50),
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
  },
  loginButtonText: {
    fontSize: scale(18),
    fontFamily:'Ubuntu_700Bold'
  },
  
});

export default LoginScreen;
