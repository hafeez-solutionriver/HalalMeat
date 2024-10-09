import React, { useState, useEffect,useContext } from 'react';
import { View, StyleSheet} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { generatePDF } from '../utils/pdfGenerator';
import { getDatabase, ref, onValue } from 'firebase/database';
import { RoleContext } from '../context/RoleContext';
import LottieView from 'lottie-react-native';
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
  const {userName} = useContext(RoleContext)
  const [filter, setFilter] = useState({
    productName:'none',
    availableStockOrder: 'none',
    reorderLevel: 'none',
    reoderQuantity:'none'

  });

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  const clearFilters = () => {
    setFilter({
    productName:'None',
    availableStockOrder: 'None',
    reorderLevel: 'None',
    reoderQuantity:'None'
    });
  };

  const handleGenerateReport = async () => {
    generatePDF(filter, products,userName,setIsLoading).then(()=>{clearFilters()});
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Generate Stock Report</Text>


          <View style={styles.section}>
            <Text style={styles.label}>Product Name</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter({ ...filter, productName: value })}
              items={[{label:"None",value:"none"},
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              
              value={filter.productName}
              
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Available Stock Order</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter({ ...filter, availableStockOrder: value })}
              items={[{label:"None",value:"none"},
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              
              value={filter.availableStockOrder}
              
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Reorder Level</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter({ ...filter, reorderLevel: value })}
              items={[{label:"None",value:"none"},
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              value={filter.reorderLevel}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Reorder Quantity</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter({ ...filter, reoderQuantity: value })}
              items={[{label:"None",value:"none"},
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              
              value={filter.reoderQuantity}
              
            />
          </View>

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
          width:scale(70) ,
          height: verticalScale(50),
          backgroundColor: '#ffff',
          borderRadius: 30,
          paddingVertical: 8,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/Animation - 1728306291658.json')}
      />}
          </View>
        </Card.Content>
      </Card>
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
    alignContent:'center',
    justifyContent:'center'
  },
  card: {
    
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Ubuntu_700Bold', // Assuming you've loaded this font
  },
  section: {
    marginBottom: 20,
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
});


