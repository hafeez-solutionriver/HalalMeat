import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getDatabase, ref, update, onValue } from 'firebase/database'; // Firebase Realtime Database import


const ITEMS_PER_PAGE = 3; // Display 3 items per page

// Fetch and listen to product changes
const fetchProducts = (setProducts, setTotalPages) => {
  const dbRef = ref(getDatabase(), 'products');
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const products = snapshot.val();
      const productList = Object.keys(products).map((productId) => ({
        id: productId,
        ...products[productId],
      }));
      setProducts(productList);

      // Calculate total pages based on products excluding headers
      const nonHeaderItems = productList.filter(item => !item.type || item.type !== 'header');
      const totalPages = Math.ceil(nonHeaderItems.length / ITEMS_PER_PAGE);
      setTotalPages(totalPages);
    } else {
      console.log("No data available");
      setProducts([]);
      setTotalPages(1);
    }
  });
};

const ViewStockSupervisorScreen = ({ navigation }) => {
  
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Keep track of the total pages
 
 
  

  useEffect(() => {
    fetchProducts(setProducts, setTotalPages);
  }, []);

 


  // Filter products by 'frozen' status
  const frozenFalseProducts = products.filter(product => product.frozen === false);
  const frozenTrueProducts = products.filter(product => product.frozen === true);

  // Combine lists with a header row for frozen products
  let combinedData = [
    ...frozenFalseProducts,
    ...(frozenTrueProducts.length > 0
      ? [{ type: 'header', title: 'Frozen Products' }, ...frozenTrueProducts]
      : []),
  ];

  // Paginate the products list, excluding the header from counting as a product
  const paginatedProducts = [];
  let itemCount = 0;
  let index = (currentPage - 1) * ITEMS_PER_PAGE;

  const hasHeaderBeforeIndex = (index) => {
    for (let i = 0; i < index; i++) {
      if (combinedData[i].type === 'header') {
        return true; // Found a header before the current index
      }
    }
    return false;
  };

  // Adjust index for Frozen header
  if (index > 0 && hasHeaderBeforeIndex(index)) {
    index += 1; // Adjust for the Frozen header
  }

  let headerAdded = false;

  while (itemCount < ITEMS_PER_PAGE && index < combinedData.length) {
    const item = combinedData[index];
    if (item.type !== 'header') {
      paginatedProducts.push(item);
      itemCount++;
    } else if (!headerAdded) {
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

  const renderProductItem = (item) => {
    const formatUnit = (value, unit) => {
      if (value > 1) {
        if (unit === 'Box') return 'Boxes';
        if (unit === 'Piece') return 'Pieces';
        if (unit === 'Kg') return 'Kgs';
      }
      return unit;
    };

    if (item.type === 'header') {
      return <Text style={styles.header} key="frozen-header">{item.title}</Text>;
    }

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
        
       
      </Card>
    );
  };

  return (
    <View style={styles.container}>
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

export default ViewStockSupervisorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: 'rgb(250,250,250)',
  },
  card: {
    height:verticalScale(150),
    marginBottom: verticalScale(12),
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
  },
  productName: {
    fontSize: scale(22),
    fontWeight: 'bold',
    fontFamily: 'Ubuntu_700Bold',
  },
  productInfo: {
    fontSize: scale(18),
    color: 'grey',
    fontFamily: 'Ubuntu_400Regular',
  },
  unitInfo: {
    fontSize: scale(14),
    color: 'grey',
    fontFamily: 'Ubuntu_400Regular',
  },
  productInfoValue: {
    fontSize: scale(18),
    fontFamily: 'Ubuntu_700Bold',
  },
  header: {
    fontSize: scale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: verticalScale(8),
    fontFamily: 'Ubuntu_700Bold',
    color: '#03A9F4',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },
  paginationButton: {
    fontSize: moderateScale(20),
    color: '#03A9F4',
    fontFamily: 'Ubuntu_700Bold',
  },
  paginationText: {
    fontSize: moderateScale(18),
    fontFamily: 'Ubuntu_400Regular',
  },
  disabledButton: {
    color: 'grey',
  },
});
