import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getDatabase, ref, remove, update, onValue } from 'firebase/database'; // Firebase Realtime Database import
import CustomModal from '../components/CustomModel';

let currentItem;

const ITEMS_PER_PAGE = 3; // Display 3 items per page

const fetchProducts = async (setProducts, setTotalPages) => {
  const dbRef = ref(getDatabase(), 'products');
  await onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const products = snapshot.val();
      const productList = Object.keys(products).map((productId) => ({
        id: productId,
        ...products[productId],
      }));
      setProducts([...productList]); // Store all products

      // Calculate the total number of pages after receiving the products
      const nonHeaderItems = productList.filter(item => !item.type || item.type !== 'header');
      const totalPages = Math.ceil(nonHeaderItems.length / ITEMS_PER_PAGE);
      setTotalPages(totalPages);
    } else {
      console.log("No data available");
      setProducts([]);
      setTotalPages(1); // Reset to 1 page if no products are available
    }
  });
};

const ManageProductsSuperScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Keep track of the total pages
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');

  // Whenever products update, recalculate the total pages
  useEffect(() => {
    fetchProducts(setProducts, setTotalPages);
  }, []);

  const handleUpdateModal = async (reorderLevel) => {
    const db = getDatabase();
    reorderLevel = parseInt(reorderLevel);

    if (isNaN(reorderLevel)) {
      Alert.alert('Error', 'Reorder Level must be valid numbers.');
      return;
    }

    // Calculate reorder quantity
    const reorderQuantity = reorderLevel - parseInt(currentItem.availableStock);
    currentItem = { ...currentItem, reorderLevel: reorderLevel, reorderQuantity: reorderQuantity };

    const productRef = ref(db, `products/${currentItem.id}`);
    await update(productRef, {
      ...currentItem,
    }).then(() => {
      setModalVisible(false);
      Alert.alert('Success', 'Reorder Level Updated!');
    });
  };

  const openModal = (item) => {
    currentItem = item;
    setValue(item.reorderLevel);
    setModalVisible(true); // Show the modal
  };

  const removeFromDatabase = async (id) => {
    const taskRef = ref(getDatabase(), `products/${id}`);
    await remove(taskRef)
      .then(() => Alert.alert('Successfully Removed!'))
      .catch((reason) => Alert.alert(reason));
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => removeFromDatabase(item.id) }
      ]
    );
  };

  // Filter products by 'frozen' status
  const frozenFalseProducts = products.filter(product => product.frozen === false);
  const frozenTrueProducts = products.filter(product => product.frozen === true);
  
  // Combine lists with a header row for frozen products
  let combinedData = [
    ...frozenFalseProducts,
    ...(frozenTrueProducts.length > 0
      ? [{ type: 'header', title: 'Frozen Products' }, ...frozenTrueProducts] // Conditionally add header and frozen products
      : []),
  ];
 
  // Paginate the products list, excluding the header from counting as a product
  const paginatedProducts = [];
  let itemCount = 0;
  let index = (currentPage - 1) * ITEMS_PER_PAGE;
console.log('index',index)
const hasHeaderBeforeIndex = (index) => {
  for (let i = 0; i < index; i++) {
    if (combinedData[i].type === 'header') {
      return true; // Found a header before the current index
    }
  }
  return false; // No header found before the current index
};
  // Check if the last page had a Frozen header and adjust the index accordingly
  if (index > 0 && hasHeaderBeforeIndex(index)) {
    console.log('last page frozen')
    index += 1; // Adjust for the Frozen header
  }

  // Keep track of whether the frozen header has been added yet
  let headerAdded = false;

  while (itemCount < ITEMS_PER_PAGE && index < combinedData.length) {
    const item = combinedData[index];

    if (item.type !== 'header') {
      paginatedProducts.push(item);
      itemCount++;
    } else if (!headerAdded) {
      // Add the header only once, but don't count it as an item
      paginatedProducts.push(item);
      headerAdded = true;
    }
    index++;
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render a single product or the frozen header
  const renderProductItem = (item) => {
    if (item.type === 'header') {
      return <Text style={styles.header} key="frozen-header">{item.title}</Text>; // Render Frozen Products header
    }

    const formatUnit = (value, unit) => {
      if (value > 1) {
        // Pluralize units if value is more than 1
        if (unit === 'Box') return 'Boxes';
        if (unit === 'Piece') return 'Pieces';
        if (unit === 'Kg') return 'Kgs';
      }
      return unit; // Return singular unit otherwise
    };
    return (
      <Card style={styles.card} key={item.id}>
        <Card.Content>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productInfo}>
            Available Stock: <Text style={styles.productInfoValue}>{item.availableStock}<Text style={styles.unitInfo}>{formatUnit(item.availableStock, item.unit)}</Text></Text>
          </Text>
          <Text style={styles.productInfo}>
            Reorder Level: <Text style={styles.productInfoValue}>{item.reorderLevel}<Text style={styles.unitInfo}>{formatUnit(item.reorderLevel, item.unit)}</Text></Text>
          </Text>
          <Text style={styles.productInfo}>
            Reorder Quantity: <Text style={styles.productInfoValue}>{item.reorderQuantity}<Text style={styles.unitInfo}>{formatUnit(item.reorderQuantity, item.unit)}</Text></Text>
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button style={{ width: '48%' }} labelStyle={styles.buttonLabel} onPress={() => openModal(item)}>Update Stock</Button>
          <Button style={{ width: '50%' }} labelStyle={styles.buttonLabel} onPress={() => handleDelete(item)}>Delete Product</Button>
        </Card.Actions>
        <CustomModal
          label={"Reorder Level"}
          visible={isModalVisible}
          title={`Update Reorder from ${value} To`}
          onUpdate={handleUpdateModal}
          onClose={() => { setModalVisible(false); }}
          initialValue={value}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Add Product Button */}
      <Button mode="contained" onPress={() => navigation.navigate('AddProduct')} style={styles.addButton} labelStyle={styles.buttonLabel}>
        Add Product
      </Button>

      {/* Product List */}
      <ScrollView>
        {paginatedProducts.map(renderProductItem)}
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
          <Text style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>{`Page ${currentPage} of ${totalPages}`}</Text>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
          <Text style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}>Next</Text>
        </TouchableOpacity>
      </View>
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
  unitInfo: {
    fontSize: scale(10),
    color: 'grey',
    fontFamily: 'Ubuntu_400Regular',
  },
  productInfoValue: {
    fontSize: scale(14),
    fontFamily: 'Ubuntu_700Bold',
  },
  header: {
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: verticalScale(5),
    fontFamily: 'Ubuntu_700Bold',
    color: '#03A9F4',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  paginationButton: {
    fontSize: moderateScale(16),
    color: '#03A9F4',
    fontFamily: 'Ubuntu_700Bold',
  },

  paginationText: {
    fontSize: moderateScale(14),
    fontFamily: 'Ubuntu_400Regular',
  },
  disabledButton: {
    color: 'grey',
  },
});

