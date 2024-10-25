import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

const ITEMS_PER_PAGE = 3;

const fetchProducts = (setProducts, setTotalPages, shop) => {
  const dbRef = ref(getDatabase(), 'products');
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const products = snapshot.val();
      const productList = Object.keys(products).map((productId) => ({
        id: productId,
        ...products[productId],
      }));

      let newProducts = productList.filter(product => product.shop === shop);
      setProducts(newProducts);

      const nonHeaderItems = newProducts.filter(item => !item.type || item.type !== 'header');
      const totalPages = Math.ceil(nonHeaderItems.length / ITEMS_PER_PAGE);
      setTotalPages(totalPages);
    } else {
      console.log("No data available");
      setProducts([]);
      setTotalPages(1);
    }
  });
};

const ViewStockSupervisorScreen = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submittedBy, setSubmittedBy] = useState('');

  const route = useRoute();
  const { shop } = route.params || {};

  // Animation setup
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProducts(setProducts, setTotalPages, shop);
    const submittedByRef = ref(getDatabase(), `shops/${shop}/submittedBy`);
    onValue(submittedByRef, (snapshot) => {
      if (snapshot.exists()) {
        const workerSubmit = snapshot.val();
        if(workerSubmit!=='')
          {startAnimation()}
        else{
          bounceValue.stopAnimation(); // Stop animation on unmount

        };
        setSubmittedBy(workerSubmit);
      }
    });

    // Start infinite bounce animation
    const startAnimation = () => {
      bounceValue.setValue(0); // Reset the bounce value
      Animated.loop(
        Animated.sequence([
          Animated.spring(bounceValue, {
            toValue: 1,
            friction: 2,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(bounceValue, {
            toValue: 0,
            friction: 2,
            tension: 40,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    

    return () => {
      bounceValue.stopAnimation(); // Stop animation on unmount
    };
  }, [shop]);

  const frozenFalseProducts = products.filter(product => product.frozen === false);
  const frozenTrueProducts = products.filter(product => product.frozen === true);

  let combinedData = [
    ...frozenFalseProducts,
    ...(frozenTrueProducts.length > 0
      ? [{ type: 'header', title: 'Frozen Products' }, ...frozenTrueProducts]
      : []),
  ];

  const paginatedProducts = [];
  let itemCount = 0;
  let index = (currentPage - 1) * ITEMS_PER_PAGE;

  const hasHeaderBeforeIndex = (index) => {
    for (let i = 0; i < index; i++) {
      if (combinedData[i].type === 'header') {
        return true;
      }
    }
    return false;
  };

  if (index > 0 && hasHeaderBeforeIndex(index)) {
    index += 1;
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

  const animatedStyle = {
    transform: [
      {
        scale: bounceValue.interpolate({
          inputRange: [0, 1.2],
          outputRange: [1, 1.1], // Adjust the scale as needed
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
     <Animated.View style={[animatedStyle, styles.cardSubmittedBy, { backgroundColor: submittedBy !== '' ? '#90EE90' : '#FF7F7F' }]}>
        <Card.Content>
          <Text style={[styles.submissionMessage]}>
            {submittedBy !== '' ? `${submittedBy.split('_')[0]} has submitted the stock of ${shop} Shop at ${submittedBy.split('_')[1]}.` : `Worker has not submitted the stock for ${shop} Shop.`}
          </Text>
        </Card.Content>
      </Animated.View>
      

      <ScrollView>
        {paginatedProducts.map(renderProductItem)}
      </ScrollView>

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
  cardSubmittedBy: {
    marginBottom: verticalScale(15),
    height:verticalScale(50),
    borderRadius:moderateScale(10)
  },
  submissionMessage: {
    fontSize: scale(16),
    color: 'white',
    fontFamily: 'Ubuntu_700Bold',
    textAlign: 'center',
  },
});
