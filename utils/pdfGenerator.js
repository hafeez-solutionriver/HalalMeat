import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generatePDF = async (filter, data,userName='Dummy',setIsLoading) => {
  
  setIsLoading(true);
  // Separate frozen and non-frozen products
  let nonFrozenProducts = data.filter((item) => !item.frozen);
  let frozenProducts = data.filter((item) => item.frozen);
  // Function to apply sorting with optional filtering (handles "none" filters)
  const applySortAndFilter = (arr, field, order) => {
   
    console.log('field',field)
    console.log('order',order)
      return arr.sort((a, b) => (order === 'asc' ? a[field] > b[field] : a[field] < b[field]) ? 1 : -1);
    
  };

  // Apply filters and sorting on non-frozen products
  
  if(filter.availableStockOrder!="none")
  {
    nonFrozenProducts =  applySortAndFilter(nonFrozenProducts, 'availableStock', filter.availableStockOrder);
    frozenProducts=applySortAndFilter(frozenProducts,'availableStock', filter.availableStockOrder);
  }
  else if(filter.productName!="none")
  {
      nonFrozenProducts =  applySortAndFilter(nonFrozenProducts, 'name', filter.productName);
      frozenProducts=applySortAndFilter(frozenProducts,'name', filter.productName);
  }
  else if(filter.reorderLevel!="none")
  {
    nonFrozenProducts =  applySortAndFilter(nonFrozenProducts, 'reorderLevel', filter.reorderLevel);
    frozenProducts=applySortAndFilter(frozenProducts,'reorderLevel', filter.reorderLevel);
  }
  else if(filter.reorderQuantity!="none")
    {
      nonFrozenProducts = applySortAndFilter(nonFrozenProducts, 'reorderQuantity', filter.reorderQuantity);
      frozenProducts=applySortAndFilter(frozenProducts,'reorderQuantity', filter.reorderQuantity);
    }

   
  
  // Get current date and time to create a unique file name
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}-${currentDate.getMinutes()
    .toString()
    .padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}`;
  const fileName = `${formattedDate}-${formattedTime}-${userName}-Report.pdf`;

  // Create report content for non-frozen products
  const nonFrozenContent = nonFrozenProducts
    .map((product) => {
      return `
        <tr>
          <td>${product.name}</td>
          <td>${product.availableStock}</td>
          <td>${product.reorderLevel}</td>
          <td>${product.reorderQuantity}</td>
        </tr>`;
    })
    .join('');

  // Create report content for frozen products
  const frozenContent = frozenProducts
    .map((product) => {
      return `
        <tr>
          <td>${product.name}</td>
          <td>${product.availableStock}</td>
          <td>${product.reorderLevel}</td>
          <td>${product.reorderQuantity}</td>
        </tr>`;
    })
    .join('');

  // Create the final report content including frozen and non-frozen sections
  const reportContent = `
    <style>
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

    <h1>Stock Report</h1>

    <table>
      <tr>
        <th>Product Name</th>
        <th>Available Stock</th>
        <th>Reorder Level</th>
        <th>Reorder Quantity</th>
      </tr>
      ${nonFrozenContent}
    </table>

    <h2>Frozen Products</h2>
    <table>
      <tr>
        <th>Product Name</th>
        <th>Available Stock</th>
        <th>Reorder Level</th>
        <th>Reorder Quantity</th>
      </tr>
      ${frozenContent}
    </table>

    <footer>
      <p>Date: ${formattedDate} ${formattedTime} - Generated by ${userName}</p>
    </footer>
  `;

  // Generate PDF using expo-print
  const { uri } = await Print.printToFileAsync({
    html: reportContent,
    base64: false,
  });

  // Share the PDF using expo-sharing
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  } else {
    console.log('Sharing is not available on this platform.');
  }
  setIsLoading(false);
};
