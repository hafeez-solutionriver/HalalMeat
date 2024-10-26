import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const CustomModal = ({ visible, onUpdate, onClose, title, label }) => {
  const [inputValue, setInputValue] = useState('');
 

  const handleUpdate = () => {
   
    onUpdate(inputValue);
    setInputValue('');
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose} >
    <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            placeholder={label}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
       </View>
       </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
 
  modalContainer: {
    width: scale(300),
    backgroundColor: 'white',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    elevation: 5,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(10),
    fontFamily: 'Ubuntu_700Bold',
  },
  input: {
    width: '100%',
    marginBottom: verticalScale(16),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#03A9F4',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(5),
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
    fontFamily: 'Ubuntu_700Bold',
  },
});
