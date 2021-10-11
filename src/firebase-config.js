/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  /* TODO: ADD YOUR FIREBASE CONFIGURATION OBJECT HERE */
  apiKey: "AIzaSyBu0V1SixoB9sHymU08uFD8BphvQTxgUBk",
  authDomain: "natulog-test.firebaseapp.com",
  databaseURL: "https://natulog-test-default-rtdb.firebaseio.com",
  projectId: "natulog-test",
  storageBucket: "natulog-test.appspot.com",
  messagingSenderId: "442256927909",
  appId: "1:442256927909:web:510acdb577610220deb14c",
  measurementId: "G-4390E4L5R0"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}
