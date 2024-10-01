import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getDatabase, ref, child, get,remove,update } from 'firebase/database'; // Firebase Realtime Database import
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../components/CustomModel';
let currentItem;
const fetchProducts = async (setProducts) => {
  const dbRef = ref(getDatabase());
  try {
    // Fetch data from 'Products' node
    const snapshot = await get(child(dbRef, 'products'));
    if (snapshot.exists()) {
      const products = snapshot.val();
      const productList = Object.keys(products).map((productId) => ({
        id: productId,
        ...products[productId],
      }));
      setProducts(productList);
    } else {
      console.log("No data available");
      setProducts([]);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const ManageProductsSuperScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');

  const handleUpdateModal = async(reorderLevel) => {
    const db = getDatabase();
    reorderLevel = parseInt(reorderLevel);

    if (isNaN(reorderLevel)) {
      Alert.alert('Error', 'Reorder Level must be valid numbers.');
      return;
    }

    // Calculate reorder quantity
    const reorderQuantity = reorderLevel-parseInt(currentItem.availableStock);
    currentItem = {...currentItem,reorderLevel:reorderLevel,reorderQuantity:reorderQuantity}

  const productRef = ref(db, `products/${currentItem.id}`);
    await update(productRef, { 
      ...currentItem,
    }).then(()=>{
      Alert.alert('Success', 'Reorder Level Updated!',[{ text: 'OK', onPress: () => fetchProducts(setProducts)}]);
    });
    
  };

  const openModal = (item) => {
    currentItem=item;
    setModalVisible(true); // Show the modal
  };
  const removeFromDatabase = async(id)=>{
    const taskRef = ref(getDatabase(), `products/${id}`);
    await remove(taskRef).then(()=>setProducts(prev => prev.filter(prod => prod.id !== id))).catch((reason)=>console.log(reason));
  
  }
  // Handle delete employee
  const handleDelete = (item) => {
    
   Alert.alert(
     'Delete Product',
     'Are you sure you want to delete this product?',
     [
       { text: 'Cancel', style: 'cancel' },
       { text: 'Yes', onPress: () => removeFromDatabase(item.id)}
     ]
   );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts(setProducts);
      
    }, [navigation])
  );

  // Filter products by 'frozen' status
  const frozenFalseProducts = products.filter(product => product.frozen === false);
  const frozenTrueProducts = products.filter(product => product.frozen === true);

  // Combine lists with a header row
  const combinedData = [
    ...frozenFalseProducts,
    ...(frozenTrueProducts.length > 0
      ? [{ type: 'header', title: 'Frozen Products' }, ...frozenTrueProducts] // Conditionally add header and frozen products
      : []),
  ];

  const handleUpdate = async(item)=>{
    setValue(item.reorderLevel);
  openModal(item);
    
  }
 // Edit existing worker logic


  // Render a single product or the frozen header
  const renderProductItem = ({ item }) => {

    const formatUnit = (value, unit) => {
      if (value > 1) {
        // Pluralize units if value is more than 1
        if (unit === 'Box') return 'Boxes';
        if (unit === 'Piece') return 'Pieces';
        if (unit === 'Kg') return 'Kgs';
      }
      return unit; // Return singular unit otherwise
    };
    if (item.type === 'header' ) {
      return <Text style={styles.header}>{item.title}</Text>; // Render header
    }
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productInfo}>Available Stock: <Text style={styles.productInfoValue}>{item.availableStock}<Text style={styles.unitInfo}>{formatUnit(item.availableStock,item.unit)}</Text></Text></Text>
          <Text style={styles.productInfo}>Reorder Level: <Text style={styles.productInfoValue}>{item.reorderLevel}<Text style={styles.unitInfo}>{formatUnit(item.reorderLevel,item.unit)}</Text></Text></Text>
          <Text style={styles.productInfo}>Reorder Quantity: <Text style={styles.productInfoValue}>{item.reorderQuantity}<Text style={styles.unitInfo}>{formatUnit(item.reorderQuantity,item.unit)}</Text></Text></Text>
        </Card.Content>
        <Card.Actions>
          <Button style={{width:'48%'}} labelStyle={styles.buttonLabel} onPress={()=>handleUpdate(item)}>Update Stock</Button>
          <Button style={{width:'50%'}} labelStyle={styles.buttonLabel} onPress={()=>handleDelete(item)}>Delete Product</Button>
        </Card.Actions>
        <CustomModal
        visible={isModalVisible}
        title={`Update Reorder from ${item.reorderLevel} To` }
        onUpdate={handleUpdateModal}
        onClose={() => setModalVisible(false)}
        initialValue={value}
      />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Add Product Button */}
      <Button mode="contained" onPress={()=>navigation.navigate('AddProduct')} style={styles.addButton} labelStyle={styles.buttonLabel}>
        Add Product
      </Button>

      {/* Product List */}
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => item.id || index.toString()} // Handle key for both product and header
        renderItem={renderProductItem}
      />
    </View>
  );
};

export default ManageProductsSuperScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: 'rgb(250,250,250)',
  },
  addButton: {
    marginBottom: verticalScale(16),
    backgroundColor: '#03A9F4',
  },
  card: {
    marginBottom: verticalScale(12),
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
  },
  productName: {
    fontSize: scale(18),
    fontWeight: 'bold',
    fontFamily: 'Ubuntu_700Bold',
  },
  productInfo: {
    fontSize: scale(14),
    color: 'grey',
    fontFamily: 'Ubuntu_400Regular',
  },
  unitInfo:{
    fontSize: scale(10),
    color: 'grey',
    fontFamily: 'Ubuntu_400Regular',
  },
  productInfoValue:{
    fontSize: scale(14),
    fontFamily: 'Ubuntu_700Bold',
  },
  header: {
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: verticalScale(12),
    fontFamily: 'Ubuntu_700Bold',
    color: '#03A9F4',
    
  },
  buttonLabel: {
    fontFamily: 'Ubuntu_700Bold',
    fontSize: moderateScale(15),
  },
});
