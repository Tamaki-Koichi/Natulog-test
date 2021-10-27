// Add a new document in collection "cities"
'use strict';

var db = firebase.firestore();
var cityRef = db.collection("cities").doc("LA");




// Add a new document with a generated id.
db.collection("tl").add({
  name: "Tokyo",
  country: "Japan"
})
.then((docRef) => {
  console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
  console.error("Error adding document: ", error);
});

// var docRef = db.collection('cities').doc('LA');

// const myTimestamp = firebase.firestore.Timestamp.now();
// const myToDated = myTimestamp.toDate();

// document.getElementById('date').textContent = dateFns.format(myToDated, "YY/MM/DD(ddd) hh:mm");



// // Update the timestamp field with the value from the server
// var updateTimestamp = docRef.update({
//     timestamp: firebase.firestore.FieldValue.serverTimestamp()
// });


db.collection("cities").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
  });
});
