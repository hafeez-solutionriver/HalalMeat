import { getDatabase, ref, onValue, off } from 'firebase/database';

import StaticMethods from './OfflineStorage';
import { Alert } from 'react-native';
let unsubscribeListener = null; // Store the listener so we can unsubscribe later

const registerForChange = (role, userId,navigation,setIsLoggedIn) => {
    const dbRef = ref(getDatabase(), `${role}/${userId}`);
    let isInitialLoad = true; // A flag to track the initial load

    unsubscribeListener = onValue(dbRef, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false; // Ignore the first call (initial data)
       
      }
       else if(snapshot.exists()) {
        // console.log(`userInfoUpdated..with ${role} with id=>${userId}`);
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
    });
};

const stopListening = () => {
    if (unsubscribeListener) {
        // Unsubscribing the Firebase onValue listener
        off(ref(getDatabase(), unsubscribeListener()));
        unsubscribeListener = null;
        // console.log("Stopped listening for changes.");
    }
};

export { registerForChange, stopListening };
