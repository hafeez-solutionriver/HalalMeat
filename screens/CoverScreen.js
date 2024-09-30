import React, {  useContext } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity  } from 'react-native';
import { RoleContext } from '../context/RoleContext'; // Role Context
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CoverPage = ({ navigation }) => {
  const { setRole,isLoggedIn } = useContext(RoleContext);  // Use RoleContext to set role
  if(isLoggedIn)
  {
    navigation.navigate('Login');
  }
  const roles = ['Worker', 'Super User', 'Supervisor'];
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);  // Set the selected role in the context
    navigation.navigate('Login');  // Navigate to Login screen
  };

  return (
    <View style={styles.container}>
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
