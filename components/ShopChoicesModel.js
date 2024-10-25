// ShopChoicesModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity,Image, StyleSheet, Button } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const ShopChoicesModal = ({ visible, onClose, options, title, message,handleOptionPress }) => {


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
        <Image source={require('../assets/shops.png')} style={{width:scale(40),height:verticalScale(40)}} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Cancel" onPress={onClose} color={'#FF7F7F'} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily:'Ubuntu_700Bold',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontFamily:'Ubuntu_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  optionText: {
    fontFamily:'Ubuntu_700Bold',
    color: 'white',
  },
});

export default ShopChoicesModal;
