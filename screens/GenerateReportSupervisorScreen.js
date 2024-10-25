import React, { useState, useEffect,useContext } from 'react';
import { View, StyleSheet,Alert} from 'react-native';
import { Button, Card, Text,RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { generatePDF } from '../utils/pdfGenerator';
import { getDatabase, ref, onValue } from 'firebase/database';
import { RoleContext } from '../context/RoleContext';
import LottieView from 'lottie-react-native';
import ShopChoicesModal from '../components/ShopChoicesModel';
import { scale,verticalScale } from 'react-native-size-matters';
// Fetch products from Firebase
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
      console.log('No data available');
      setProducts([]);
    }
  });
};

const GenerateReportSupervisorScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([]);
  const [reportType,setReportType]=useState('Consolidated');
  const [modalVisible, setModalVisible] = useState(false);
  const options = ["Hounslow", "South hall", "Hayes"];

  const {userName} = useContext(RoleContext)
  const [filter, setFilter] = useState({
    productName:'none',
    availableStockOrder: 'none',
    reorderLevel: 'none',
    reorderQuantity:'none'

  });

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);
  const handleFilterChange = (filterName, value) => {
    setFilter((prevState) => {
      const newFilter = { ...prevState };
      newFilter[filterName] = value;
      if (value !== 'none') {
        // Reset other filters to "none" if a new filter is selected
        for (const key in newFilter) {
          if (key !== filterName) {
            newFilter[key] = 'none';
          }
        }
      }
      return newFilter;
    });
  };
  const clearFilters = () => {
    setFilter({
    productName:'none',
    availableStockOrder: 'none',
    reorderLevel: 'none',
    reorderQuantity:'none'
    });
  };
 
  const handleOptionPress = (option)=>{
    console.log('this option clicekd',option)
    setModalVisible(false);
    generatePDF(filter, products,userName,option,setIsLoading).then(()=>{clearFilters()});


  }
  const handleGenerateReport = async () => {
    
if(reportType==='Consolidated')
{
  generatePDF(filter, products,userName,reportType,setIsLoading).then(()=>{clearFilters()});

}
else{
setModalVisible(true);
}
    
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Generate Stock Report</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subTitle}>Filters</Text>
          <View style={styles.section}>
            <Text style={styles.label}>Product Name</Text>
            <RNPickerSelect
              onValueChange={(value) => handleFilterChange('productName', value)}
              items={[{ label: 'None', value: 'none' }, { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' }]}
              value={filter.productName}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Available Stock Order</Text>
            <RNPickerSelect
              onValueChange={(value) => handleFilterChange('availableStockOrder', value)}
              items={[{ label: 'None', value: 'none' }, { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' }]}
              value={filter.availableStockOrder}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Reorder Level</Text>
            <RNPickerSelect
              onValueChange={(value) => handleFilterChange('reorderLevel', value)}
              items={[{ label: 'None', value: 'none' }, { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' }]}
              value={filter.reorderLevel}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Reorder Quantity</Text>
            <RNPickerSelect
              onValueChange={(value) => handleFilterChange('reorderQuantity', value)}
              items={[{ label: 'None', value: 'none' }, { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' }]}
              value={filter.reorderQuantity}
            />
          </View>

          <Text style={styles.subTitle}>Report type</Text>

        <RadioButton.Group onValueChange={setReportType} value={reportType}>
        <View style={styles.radioButtonRow}>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Consolidated" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Consolidated</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Individual" color="#03A9F4" />
            <Text style={styles.radioButtonLabel}>Individual</Text>
          </View>
          </View>
        </RadioButton.Group>
          {/* Buttons Section */}
          <View style={styles.buttonGroup}>
            <Button
              mode="outlined"
              onPress={clearFilters}
              style={styles.clearButton}
              icon="filter-remove"
              labelStyle={styles.clearButtonText}
            >
              Clear
            </Button>
            { !isLoading && <Button
              mode="contained"
              onPress={handleGenerateReport}
              style={styles.generateButton}
              icon="file-pdf-box"
              labelStyle={styles.generateButtonText}
            >
              Generate
            </Button>}
            {isLoading && <LottieView
              autoPlay
              style={{
                width: scale(70),
                height: verticalScale(50),
                backgroundColor: '#ffff',
                borderRadius: 30,
                paddingVertical: 8,
              }}
              source={require('../assets/Animation - 1728306291658.json')}
            />}
          </View>
        </Card.Content>
      </Card>
      <ShopChoicesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={options}
        title="Choose an option"
        message="Select a shop from the following:"
        handleOptionPress={handleOptionPress}
      />
    </View>
  );
};
export default GenerateReportSupervisorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexDirection:'column',
  },
  card: {
    // marginTop:5,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold', // Assuming you've loaded this font
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold', // Assuming you've loaded this font
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Ubuntu_700Bold', // Assuming you've loaded this font
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    borderColor: '#6200ee',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: '#6200ee',
    fontFamily: 'Ubuntu_700Bold',
  },
  generateButton: {
    backgroundColor: '#6200ee',
    borderRadius: 30,
    paddingVertical: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontFamily: 'Ubuntu_700Bold',
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
    width: '50%', // Adjust the width for two items per row
  },
  radioButtonLabel: {
    fontSize: scale(14),
    fontFamily: 'Ubuntu_400Regular',
  },
});


