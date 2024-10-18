import React, {  useState } from 'react';
import { Modal, View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const CustomModal = ({ visible, onUpdate, onClose,title,label }) => {
const [inputValue, setInputValue] = useState('');
  const slideAnim = useState(new Animated.Value(-500))[0]; // Slide animation (off-screen)
  const fadeAnim = useState(new Animated.Value(0))[0]; // Fade animation

 
  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, // Move to position 0 (onscreen)
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -500, // Slide out
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(); // Close the modal after the animation
    });
  };

  const handleUpdate = () => {
  
    onUpdate(inputValue); // Pass the input value back to the parent
   setInputValue('');
  };

  if (visible) {
    startAnimation();
  }

  return (
    <Modal transparent={true} visible={visible} animationType="none" onRequestClose={closeModal}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.modalTitle}>{title}</Text>
          
        
        <TextInput
        label={label}
        value={inputValue}
        onChangeText={setInputValue}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent overlay
  },
  modalContainer: {
    width: scale(300),
    backgroundColor: 'white',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    elevation: 5, // Shadow for Android
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(10),
    fontFamily: 'Ubuntu_700Bold', // Fabric font
  },
  input: {
    width: '100%',
    marginBottom: verticalScale(16),
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(5),
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(5),
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: 'Ubuntu_700Bold', // Fabric font
  },
});
