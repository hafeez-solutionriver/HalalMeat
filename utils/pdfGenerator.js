import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export const generatePDF = async (filter, data, userName = 'Dummy', reportType, setIsLoading) => {
  setIsLoading(true);

  // Separate frozen and non-frozen products by shop
  const shopProducts = {
    'Hounslow': { nonFrozen: [], frozen: [] },
    'South hall': { nonFrozen: [], frozen: [] },
    'Hayes': { nonFrozen: [], frozen: [] }
  };

  data.forEach(item => {
    if (item.frozen) {
      shopProducts[item.shop]?.frozen.push(item);
    } else {
      shopProducts[item.shop]?.nonFrozen.push(item);
    }
  });

  // Function to apply sorting with optional filtering (handles "none" filters)
  const applySortAndFilter = (arr, field, order) => {
    return arr.sort((a, b) => (order === 'asc' ? a[field] > b[field] : a[field] < b[field]) ? 1 : -1);
  };

  // Apply filters and sorting
  const sortAndFilterProducts = (products) => {
    if (filter.availableStockOrder !== "none") {
      return applySortAndFilter(products, 'availableStock', filter.availableStockOrder);
    } else if (filter.productName !== "none") {
      return applySortAndFilter(products, 'name', filter.productName);
    } else if (filter.reorderLevel !== "none") {
      return applySortAndFilter(products, 'reorderLevel', filter.reorderLevel);
    } else if (filter.reorderQuantity !== "none") {
      return applySortAndFilter(products, 'reorderQuantity', filter.reorderQuantity);
    }
    return products; // return original if no filters
  };

  // Sort and filter products for each shop
  for (const shop in shopProducts) {
    shopProducts[shop].nonFrozen = sortAndFilterProducts(shopProducts[shop].nonFrozen);
    shopProducts[shop].frozen = sortAndFilterProducts(shopProducts[shop].frozen);
  }

  // Get current date and time to create a unique file name
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}-${currentDate.getMinutes().toString().padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}`;

  // Create report content
  const createShopTable = (shop, products) => {
    const nonFrozenContent = products.nonFrozen.map(product => `
      <tr>
        <td style="border: 1px solid black; padding: 5px;">${product.name}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.availableStock}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.reorderLevel}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.reorderQuantity}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.unit}</td>
        <td style="border: 1px solid black; padding: 5px;"></td>
      </tr>`).join('');
  
    const frozenContent = products.frozen.map(product => `
      <tr>
        <td style="border: 1px solid black; padding: 5px;">${product.name}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.availableStock}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.reorderLevel}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.reorderQuantity}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.unit}</td>
        <td style="border: 1px solid black; padding: 5px;"></td>
      </tr>`).join('');
  
    return `
      <h2>${shop} Shop Products</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid black; padding: 5px;">Product Name</th>
          <th style="border: 1px solid black; padding: 5px;">Available Stock</th>
          <th style="border: 1px solid black; padding: 5px;">Reorder Level</th>
          <th style="border: 1px solid black; padding: 5px;">Reorder Quantity</th>
          <th style="border: 1px solid black; padding: 5px;">Unit</th>
          <th style="border: 1px solid black; padding: 5px;">Comments</th>
        </tr>
        ${nonFrozenContent}
      </table>
      <h3>Frozen Products</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid black; padding: 5px;">Product Name</th>
          <th style="border: 1px solid black; padding: 5px;">Available Stock</th>
          <th style="border: 1px solid black; padding: 5px;">Reorder Level</th>
          <th style="border: 1px solid black; padding: 5px;">Reorder Quantity</th>
          <th style="border: 1px solid black; padding: 5px;">Unit</th>
          <th style="border: 1px solid black; padding: 5px;">Comments</th>
        </tr>
        ${frozenContent}
      </table>
    `;
  };
  

  let reportContent = `<style>
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      th {
        background-color: #4CAF50;
        color: white;
      }
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
    </style>
    <h1>${reportType==='Consolidated'?'Consolidated':`${reportType} Shop`} Stock Report</h1>`;

  // Generate content based on report type
  if (reportType === 'Consolidated') {
    for (const shop in shopProducts) {
      reportContent += createShopTable(shop, shopProducts[shop]);
    }
  } else if (shopProducts[reportType]) {
    reportContent += createShopTable(reportType, shopProducts[reportType]);
  }

  reportContent += `
    <footer>
      <p>Date: ${formattedDate} ${formattedTime} - Generated by ${userName}</p>
    </footer>
  `;

  const fileName = `${formattedDate}-${formattedTime}-Report.pdf`;

  // Generate PDF using expo-print
  const { uri } = await Print.printToFileAsync({
    html: reportContent,
    base64: false,
  });

  const newUri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.moveAsync({
    from: uri,
    to: newUri,
  });
  // Share the PDF using expo-sharing
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(newUri);
  } else {
    console.log('Sharing is not available on this platform.');
  }
  setIsLoading(false);
};
