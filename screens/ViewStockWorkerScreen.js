import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getDatabase, ref,update,onValue } from 'firebase/database'; // Firebase Realtime Database import
import CustomModal from '../components/CustomModel';
let currentItem;
 // Fetch and listen to product changes
 const fetchProducts = (setProducts) => {
  const dbRef = ref(getDatabase(), 'products');
   onValue(dbRef, (snapshot) => {
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
  });
};

const ViewStockWorkerScreen= ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');

  const handleUpdateModal = async(availableStock) => {
    const db = getDatabase();
    availableStock = parseInt(availableStock);

    if (isNaN(availableStock)) {
      Alert.alert('Error', 'Available Stock must be valid numbers.');
      return;
    }

    // Calculate reorder quantity
    const reorderQuantity = currentItem.reorderLevel-availableStock;
    currentItem = {...currentItem,availableStock:availableStock,reorderQuantity:reorderQuantity}

  const productRef = ref(db, `products/${currentItem.id}`);
    await update(productRef, { 
      ...currentItem,
    }).then(()=>{
      setModalVisible(false)
      Alert.alert('Success', 'Available Stock Updated!');
    });
    
  };

  const openModal = (item) => {
    currentItem=item;
    setModalVisible(true); // Show the modal
  };
  useEffect(()=>{
    fetchProducts(setProducts);
  },[])
  

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
      if (value > 1 || value < 0) {
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
          <Button style={{width:'100%'}} labelStyle={styles.buttonLabel} onPress={()=>handleUpdate(item)}>Update Available Stock</Button>
        </Card.Actions>
        <CustomModal
        label={"Available Stock"}
        visible={isModalVisible}
        title={`Update Available Stock from ${value} To` }
        onUpdate={handleUpdateModal}
        onClose={() => setModalVisible(false)}
        initialValue={value}
      />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Product List */}
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => item.id || index.toString()} // Handle key for both product and header
        renderItem={renderProductItem}
      />
    </View>
  );
};

export default ViewStockWorkerScreen;

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
