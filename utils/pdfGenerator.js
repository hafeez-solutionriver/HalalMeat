import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export const generatePDF = async (filter, data) => {
  console.log('filter', filter);
  console.log('data', data);

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
  const fileName = `${formattedDate}-${formattedTime}-Report.pdf`;

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
      ${Object.keys(data)
        .map((key) => {
          const product = data[key];
          return `
            <tr>
              <td>${product.name}</td>
              <td>${product.availableStock}</td>
              <td>${product.reorderLevel}</td>
              <td>${product.reorderQuantity}</td>
            </tr>
          `;
        })
        .join('')}
    </table>

    <h2>Frozen Products</h2>
    <table>
      <tr>
        <th>Product Name</th>
        <th>Available Stock</th>
        <th>Reorder Level</th>
        <th>Reorder Quantity</th>
      </tr>
      ${Object.keys(data)
        .filter((key) => data[key].frozen)
        .map((key) => {
          const product = data[key];
          return `
            <tr>
              <td>${product.name}</td>
              <td>${product.availableStock}</td>
              <td>${product.reorderLevel}</td>
              <td>${product.reorderQuantity}</td>
            </tr>
          `;
        })
        .join('')}
    </table>
  `;

  // Generate PDF using expo-print
  const { uri } = await Print.printToFileAsync({
    html: reportContent,
    base64: false,
  });

  // Rename the file using expo-file-system
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
};
