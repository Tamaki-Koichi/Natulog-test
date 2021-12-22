const config = {
  /* TODO: ADD YOUR FIREBASE CONFIGURATION OBJECT HERE */
  // apiKey: "AIzaSyAflUJ4G9RWq-uiVQ9ywipbMrjWYUB2gr8",
  // authDomain: "friendly-chat-test-data.firebaseapp.com",
  // projectId: "friendly-chat-test-data",
  // storageBucket: "friendly-chat-test-data.appspot.com",
  // messagingSenderId: "902472895755",
  // appId: "1:902472895755:web:99ade4b281f1e7afa9660e"
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