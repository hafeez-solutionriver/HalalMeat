import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { generatePDF } from '../utils/pdfGenerator';
import { getDatabase, ref, onValue } from 'firebase/database';
import { moderateVerticalScale } from 'react-native-size-matters';
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
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    stockOrder: 'asc',
    reorderLevel: 'asc',
  });

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  const clearFilters = () => {
    setFilter({
      stockOrder: 'asc',
      reorderLevel: 'asc',
    });
  };

  const handleGenerateReport = async () => {
    generatePDF(filter, products);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Generate Stock Report</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Available Stock Order</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter({ ...filter, stockOrder: value })}
              items={[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              
              value={filter.stockOrder}
              
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Reorder Level</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter({ ...filter, reorderLevel: value })}
              items={[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              value={filter.reorderLevel}
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

            <Button
              mode="contained"
              onPress={handleGenerateReport}
              style={styles.generateButton}
              icon="file-pdf-box"
              labelStyle={styles.generateButtonText}
            >
              Generate
            </Button>
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


