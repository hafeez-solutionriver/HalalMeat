import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Menu, Divider } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { getDatabase, ref, push } from 'firebase/database';

const AddProductScreen = ({ navigation }) => {
  // State variables to hold input values
  const [productName, setProductName] = useState('');
  let availableStock = 0;
  const [reorderLevel, setReorderLevel] = useState('');
  const [frozen, setFrozen] = useState('yes'); // Radio button value for frozen
  const [unit, setUnit] = useState('Piece'); // Dropdown state for unit
 

  // Function to handle submitting the new product
  const handleSubmit = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products'); // Reference to the 'Products' node

    // Validate inputs
    if (!productName ||   !reorderLevel || !unit) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    
    const reorderLevelNumber = parseInt(reorderLevel);

    if (isNaN(availableStock) || isNaN(reorderLevelNumber)) {
      Alert.alert('Error', 'Stock and Reorder Level must be valid numbers.');
      return;
    }

    // Calculate reorder quantity
    const reorderQuantity = reorderLevelNumber-availableStock;

    if(reorderQuantity<0)
    {
      reorderQuantity=0;
    }
    // Add new product logic
     // Generate a new unique ID
    await push(productsRef, {
      name: productName,
      availableStock: availableStock,
      reorderLevel: reorderLevelNumber,
      reorderQuantity: reorderQuantity,
      frozen: frozen === 'yes',
      unit: unit, // Add unit to database
    }).then(()=>{
        setProductName('');
        setReorderLevel('');
        setFrozen('yes');
        setUnit('Piece');
        Alert.alert('Success', 'New product added successfully!', [
            {text: 'OK', onPress: () => navigation.navigate('Manage Product')},
          ]);
        
        
    }).catch((error)=>console.log(error));

    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Product</Text>

      {/* Product Name Input */}
      <TextInput
        label="Product Name"
        value={productName}
        onChangeText={setProductName}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />

      
      

      {/* Reorder Level Input */}
      <TextInput
        label="Reorder Level"
        value={reorderLevel}
        onChangeText={setReorderLevel}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#03A9F4', text: '#000' } }}
      />

      {/* Frozen Radio Button */}
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Is the product frozen?</Text>
        <RadioButton.Group onValueChange={setFrozen} value={frozen}>
        <View style={styles.radioButtonRow}>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="yes" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Yes</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="no" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>No</Text>
          </View>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>UOM - Unit of Measurement </Text>
        <RadioButton.Group onValueChange={setUnit} value={unit} >
        <View style={styles.radioButtonRow}>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Piece" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Piece</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Kg" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Kg</Text>
          </View>

          <View style={styles.radioButtonContainer}>
            <RadioButton value="Box" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Box</Text>
          </View>
          </View>
        </RadioButton.Group>
      </View>
      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        Add Product
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: 'rgb(250,250,250)',
    justifyContent: 'center',
  },
  heading: {
    fontSize: scale(30),
    textAlign: 'center',
    marginBottom: verticalScale(16),
    fontFamily: 'Ubuntu_700Bold',
  },
  input: {
    width: '100%',
    marginBottom: verticalScale(16),
    backgroundColor: 'white',
  },
  radioGroup: {
    
  },
  radioLabel: {
    fontSize: scale(16),
    marginStart: moderateScale(5),
    marginBottom: verticalScale(8),
    fontFamily: 'Ubuntu_400Regular',
  },
  radioButtonRow: {
    flexDirection: 'row', // Make the radio buttons align horizontally
    flexWrap: 'wrap', // Wrap to the next row if there are more items
     // Space the items evenly
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    width: '30%', // Adjust the width for two items per row
  },
  radioButtonLabel: {
    fontSize: scale(16),
    fontFamily: 'Ubuntu_400Regular',
  },
  submitButton: {
    width: '100%',
    height: verticalScale(50),
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
  },
  submitButtonText: {
    fontSize: scale(18),
    fontFamily: 'Ubuntu_700Bold',
  },
});

export default AddProductScreen;
