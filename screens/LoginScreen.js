import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { RoleContext } from '../context/RoleContext';
import { getDatabase, ref, child, get } from 'firebase/database';  // Firebase Realtime Database
import { initializeApp, getApps } from 'firebase/app';
import StaticMethods from '../utils/OfflineStorage';
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
  const { role, setIsLoggedIn, setUserName, setUserEmail } = useContext(RoleContext);

  const redirect = async (userName,userEmail,route)=>{
    const data = {
      isLoggedIn: true,
      userEmail:userEmail,
      role: role,
      userName: userName
    };
    
    // Store the entire object at once
    await StaticMethods.storeData(data).then(()=>navigation.navigate(route));
  }
  const handleLogin = () => {
    setIsLoggedIn(true);

    if (role === 'Worker') {
      setUserEmail('worker@gmail.com');
      setUserName('Worker Name');
      redirect('worker@gmail.com','Worker Name','View Stock Worker')
      
    } else if (role === 'Super User') {
      setUserEmail('superuser@gmail.com');
      setUserName('Super User Name');
      redirect('superuser@gmail.com','Super User Name','Manage Employees');
    } else if (role === 'Supervisor') {
      setUserEmail('supervisor@gmail.com');
      setUserName('Supervisor Name');
      redirect('supervisor@gmail.com','Supervisor Name','View Stock');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/ic_login.png')}
        style={styles.loginIcon}
      />
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={text => setEmail(text)}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />
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
    backgroundColor: 'rgb(250,250,250)',
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
