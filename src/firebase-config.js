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
  apiKey: "AIzaSyDJc73DKi_4z8TJHPlcMcnXweyEFrC8g8c",
  authDomain: "natulog-official.firebaseapp.com",
  projectId: "natulog-official",
  storageBucket: "natulog-official.appspot.com",
  messagingSenderId: "254503184303",
  appId: "1:254503184303:web:f5e94f480dba2d8e1b715a",
  measurementId: "G-YB06B4WL7E"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}