import { getDatabase, ref, onValue,off } from 'firebase/database';

import StaticMethods from './OfflineStorage';
let unsubscribeListener = null; // Store the listener so we can unsubscribe later

const registerForChange = (role,userId) =>{
    
    const dbRef = ref(getDatabase(), `${role}/${userId}`);
    unsubscribeListener = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(`userInfoUpdated..with ${role} with id=>${userId}`);
        // StaticMethods.clearData().then(()=>navigation.navigate('Cover'))
      }
    });
}

const stopListening = () => {
    if (unsubscribeListener) {
        // Unsubscribing the Firebase onValue listener
        off(ref(getDatabase(), unsubscribeListener()));
        unsubscribeListener = null;
        console.log("Stopped listening for changes.");
    }
};
export {registerForChange,stopListening};