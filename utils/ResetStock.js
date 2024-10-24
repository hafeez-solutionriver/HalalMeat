import { getDatabase, ref, update, get } from 'firebase/database'; // Firebase Realtime Database

const resetStock = async () => {
  const db = getDatabase();
  const productsRef = ref(db, 'products');
  const lastUpdatedRef = ref(db, 'lastUpdatedDate');
  const shopsRef = ref(db, 'shops'); // Reference to the shops collection

  const updates = {};

  try {
    // Get current date in YYYY-MM-DD format based on local time
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    // Fetch the last updated date from the database
    const lastUpdatedSnapshot = await get(lastUpdatedRef);
    const lastUpdatedDate = lastUpdatedSnapshot.exists() ? lastUpdatedSnapshot.val() : null;

    if (lastUpdatedDate === formattedDate) {
      return; // Exit the function as no reset is needed
    }

    // Continue to reset stock if the dates don't match
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const products = snapshot.val();

      for (const productId in products) {
        const product = products[productId];

        // Reset available stock to 0
        updates[`/products/${productId}/availableStock`] = 0;
        const reorderQuantity = product.reorderLevel; // Reorder level - available stock (0 after reset)
        updates[`/products/${productId}/reorderQuantity`] = reorderQuantity;
      
      
      }


      // Reset submittedBy for each shop to an empty string
      const shopsSnapshot = await get(shopsRef);
      if (shopsSnapshot.exists()) {
        const shops = shopsSnapshot.val();
        for (const shopId in shops) {
          updates[`/shops/${shopId}/submittedBy`] = '';
        }
      }
        // Update the products and set the new lastUpdatedDate
        updates['/lastUpdatedDate'] = formattedDate;
      
      await update(ref(db), updates); // Update the entire database at once
    } else {
      console.log("No products found.");
    }
  } catch (error) {
    console.error("Error resetting stock and updating reorder quantities:", error);
  }
};

export default resetStock;
