import React, { useEffect, useState,useContext } from 'react';
import { View, Text, ScrollView,Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, update,get,child, onValue } from 'firebase/database';
import CustomModal from '../components/CustomModel';
import { scale, verticalScale } from 'react-native-size-matters';
import StaticMethods from '../utils/OfflineStorage';
import { stopListening } from '../utils/UserInfoChange';
import { RoleContext } from '../context/RoleContext';
let currentItem;
let shop;
const ITEMS_PER_PAGE = 11; 
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
      
      console.log('shop on filter..',shop)
      let newProducts = productList.filter(product => product.shop == shop); // Replace `shopArgument` with your actual variable
      console.log("after filtering",newProducts)
      setProducts(newProducts);

      // Calculate total pages based on products excluding headers
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

const reAuthenticateUser = async (navigation,setIsLoggedIn) =>{
  console.log('reauthenticate called..')
const userLocalData = await StaticMethods.getStoredData();
const dbRef = ref(getDatabase(), 'Worker');
if(userLocalData.userId){
console.log('local data in view stock',userLocalData)
  try {
    // Fetch users from Firebase Realtime Database
    const snapshot = await get(child(dbRef,`/${userLocalData.userId}`));

    if (snapshot.exists()) {
      const user = snapshot.val();
      if(user.email===userLocalData.userEmail && user.password===userLocalData.userPassword && user.name===userLocalData.userName){
        console.log('nothing changed in user data');
        
      }
      else
      {
        console.log('user data has been changed...!');
        Alert.alert('Session is out!', 'You need to log in again', [
          
          {
            text: 'OK',
            onPress: async() => {
              setIsLoggedIn(false);
              stopListening();
              await StaticMethods.clearData().then(()=>navigation.navigate('Cover'))
              ;
            },
          },
        ]);
        
      }

    }
    else
    {
      console.log('user does not exist means user data has been changed')
      
      Alert.alert('Session is out!', 'You need to log in again', [
        
        {
          text: 'OK',
          onPress: async() => {
            setIsLoggedIn(false);
            stopListening();
            await StaticMethods.clearData().then(()=>navigation.navigate('Cover'))
            ;
          },
        },
      ]);
    } 
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong while fetching user data.');
   
  }
}

};


const ViewStockWorkerScreen = ({navigation,route}) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Keep track of the total pages
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const {setIsLoggedIn,userShop,setUserShop } = useContext(RoleContext);
  shop=userShop;
  const {userShop:passedUserShop} = route.params ||{}
  useEffect(() => {
    if (passedUserShop) {
      setUserShop(passedUserShop);
    }
  }, [passedUserShop]);


  const authenticateAndFetch = async (navigation,setIsLoggedIn)=>{
   await reAuthenticateUser(navigation,setIsLoggedIn).then(()=>fetchProducts(setProducts, setTotalPages,userShop));
  }
  useEffect( () => {
     authenticateAndFetch(navigation,setIsLoggedIn)
  },[]);

  const handleUpdateModal = async (availableStock) => {
    const db = getDatabase();
    availableStock = Number(availableStock);

    if (isNaN(availableStock)) {
      Alert.alert('Error', 'Available Stock must be valid number.');
      return;
    }
    else if(availableStock<0 || availableStock>currentItem.reorderLevel)
    {
      Alert.alert('Error', 'Available Stock must be greater than zero and less than Reorder Level.');
      return;
    }

    // Calculate reorder quantity
    let reorderQuantity = currentItem.reorderLevel - availableStock;
    if (reorderQuantity < 0) {
      reorderQuantity = 0;
    }
    currentItem = { ...currentItem, availableStock: availableStock, reorderQuantity: reorderQuantity };

    const productRef = ref(db, `products/${currentItem.id}`);
    await update(productRef, {
      ...currentItem,
    }).then(() => {
      setModalVisible(false);
      
      Alert.alert('Success', 'Available Stock Updated!');
    }).catch(()=>{ 
      setModalVisible(false);
      Alert.alert('Failed!', 'Available Stock could not Updated!');});
  };

  const openModal = (item) => {
    currentItem = item;
    setValue(item.availableStock);
    setModalVisible(true);
  };

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

  // Render the table headers
  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Product{"\n"}Name</Text>
      <Text style={styles.headerCell}>Available{"\n"}Stock</Text>
      <Text style={styles.headerCell}>Reorder{"\n"}Level</Text>
      <Text style={styles.headerCell}>Reorder{"\n"}Quantity</Text>
    </View>
  );

  // Render the table rows
  const renderTableRows = () => paginatedProducts.map((item, index) => {
    
    const rowStyle = item.availableStock == 0 ? styles.redRow : styles.greenRow;
    if (item.type === 'header') {
      return (
        <View key={index} style={[styles.row, styles.frozenHeader]}>
          <Text style={styles.cellFrozen}>{item.title}</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity key={index} style={[styles.row, rowStyle]} onPress={() => openModal(item)}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.availableStock}</Text>
        <Text style={styles.cell}>{item.reorderLevel}</Text>
        <Text style={styles.cell}>{item.reorderQuantity}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.table}>
          {/* Table Header */}
          {renderTableHeader()}
          {/* Table Rows */}
          {renderTableRows()}
        </View>
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

      {/* Update Modal */}
      <CustomModal
        label={"Available Stock"}
        visible={isModalVisible}
        title={`Update Available Stock from ${value} To`}
        onUpdate={handleUpdateModal}
        onClose={() => setModalVisible(false)}
        
      />
    </View>
  );
};

export default ViewStockWorkerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(250,250,250)',
  },
  table: {
    color: '#fff',
    borderWidth: 1,
    borderColor: '#c8e1ff',
    width: scale(350),
  },
  headerRow: {
    color: '#fff',
    flexDirection: 'row',
    backgroundColor: '#03A9F4', // Same color as Frozen Products
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#c8e1ff',
    color: '#fff',
  },
  redRow: {
    backgroundColor: '#FF7F7F', // Light grey for alternating rows
  },
  greenRow: {
    backgroundColor: '#90EE90', // White for alternating rows
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold', // Use the desired font
  },
  cell: {
    marginLeft: scale(15),
    width: scale(70),
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold',
  },
  cellFrozen: {
    marginLeft: scale(15),
    
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold',
    color:'#fff',
    backgroundColor:'#03A9F4'
  },
  updateButton: {
    color: 'blue',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  paginationButton: {
    fontSize: 18,
    color: '#03A9F4',
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 16,
  },
  disabledButton: {
    color: 'grey',
  },
  frozenHeader: {
    backgroundColor: '#03A9F4',
    color:'#fff',
   alignContent:'center',
   justifyContent:'center',
    paddingVertical:verticalScale(5)
  }});