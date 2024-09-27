import React, { useState } from 'react';
import { View, StyleSheet, Image} from 'react-native';
import { TextInput, Button, Menu, Text } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [visible, setVisible] = useState(false);

  const roles = ['Worker', 'Super User', 'Supervisor'];

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
        
      />

      {/* Password Field */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      {/* Role Dropdown */}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu} style={styles.roleSelection}>Select a Role ▼</Button>}
        style={styles.menu}
        anchorPosition='top'
        contentStyle={{backgroundColor:'white'}}
      >
        {roles.map((roleOption, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              setRole(roleOption);
              closeMenu();
            }}
            title={roleOption}
          />
        ))}
      </Menu>

      {/* Login Button */}
      <Button
        mode="contained"
        onPress={() => console.log('Login')}
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
  },
  loginIcon: {
    width: scale(150),
    height: verticalScale(150),
    marginBottom: verticalScale(32),
  },
  input: {
    width: '100%',
    marginBottom: verticalScale(16),
    backgroundColor:'white',
    
    
  },
  menu: {

    width: '90%',
    left:scale(15),
  },
  loginButton: {
    marginTop: verticalScale(24),
    width: '100%',
    height: verticalScale(50),
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
  },
  loginButtonText: {
    fontSize: scale(18),
  },
  roleSelection:{
    right:scale(100)
  }
});

export default LoginScreen;
