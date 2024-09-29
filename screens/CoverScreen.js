import React, { useEffect, useContext, useCallback, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity  } from 'react-native';
import { RoleContext } from '../context/RoleContext'; // Role Context
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import * as SplashScreen from 'expo-splash-screen';  // Import SplashScreen API
import { useFonts, Ubuntu_400Regular,Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';

SplashScreen.preventAutoHideAsync(); // Prevents the splash screen from auto-hiding

const CoverPage = ({ navigation }) => {
  const { setRole } = useContext(RoleContext);  // Use RoleContext to set role
  const roles = ['Worker', 'Super User', 'Supervisor'];
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

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);  // Set the selected role in the context
    navigation.navigate('Login');  // Navigate to Login screen
  };

  

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
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* Card containing logo and heading */}
      <View style={styles.card}>
        {/* Centered Logo */}
        <Image
          source={require('../assets/shop.png')} // Your logo image
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome heading */}
        <Text style={styles.welcomeText}>Welcome to Halal Meat Shop</Text>
      </View>

      {/* Role selection buttons below the card */}
      <View style={styles.buttonsContainer}>
        {roles.map((role, index) => (
          <TouchableOpacity
            key={index}
            style={styles.roleButton}
            onPress={() => handleRoleSelect(role)}
          >
           
            <Text style={styles.buttonLabel}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff', // Light background color for a clean look
  },
  card: {
    width: '100%',
    height:'60%',
    backgroundColor: '#fff', // White background for the card
    padding: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: moderateScale(30), // Rounded bottom corners for the card
    borderBottomRightRadius: moderateScale(30),
    shadowColor: '#000', // Shadow for some elevation effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: '100%', // Logo covers full width of the card
    height: verticalScale(250),  // Adjust logo height as needed
    
  },
  welcomeText: {
    fontSize: scale(24),
    fontFamily: 'Ubuntu_700Bold', // Ubuntu font
    color: '#333',
    textAlign: 'center',
    lineHeight:40
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(40),
    backgroundColor: 'rgb(250,250,250)'
  },
  roleButton: {
    backgroundColor: '#0288D1',
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: scale(16),
    color: '#fff', // White text for buttons
    fontFamily: 'Ubuntu_700Bold',
  },
});

export default CoverPage;
