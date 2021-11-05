'use strict';

var db = firebase.firestore();
var messagesRef = db.collection("messages");

var addDoc;

// ログアウト処理
function logout() {
  firebase.auth().onAuthStateChanged(function(user){
    firebase.auth().signOut().then(()=>{
				location.href = './signin.html';
				toggleSignIn();
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  });
}

async function saveMessage(messageText) {
  // TODO 7: Push a new message to Cloud Firestore.
  // Add a new message entry to the Firebase database.
  db.collection("messages").doc().set({
    name: userName,
    text: messageText,
    timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
  });
}

function loadMessages() {
  messagesRef.orderBy("timestamp","desc").limit(5)
  .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        displayMessage(doc.id, doc.data().timestamp, doc.data().name,doc.data().text, '', '')
      });
  })
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
  var messageListElement = document.getElementById('messages');

  var div =
    document.getElementById(id) || createAndInsertMessage(id, timestamp,name);
    console.log(div);
  // profile picture
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }
  const myToDated = timestamp.toDate();
  div.querySelector('.date').textContent = dateFns.format(myToDated, "YY/MM/DD(ddd) hh:mm");
  
  const userName = name;
  div.querySelector('.name').textContent = userName;

  var messageElement = div.querySelector('.message');

  if (text) {
    // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');

  } else if (imageUrl) {
    // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function () {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function () {
    div.classList.add('visible');
  }, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Template for messages.
var MESSAGE_TEMPLATE =

'<div class="row justify-content-between border-bottom">' + 
  '<div class="col-5 d-flex justify-content-start">' +
    '<img class="posted-img" src="./images/麻雀女子 3.png" alt="">' +
    '<a href="#" class="align-self-start"><div class="name"></div></a>' +
  '</div>' +
  '<div class="col-4 d-flex justify-content-end">' +
    '<div class="date"></div>' +
  '</div>' +
  '<div class="row justify-content-center">' +
    '<div class="col-7 align-self-center">' +
      '<div class="message"></div>' +
    '</div>' +
  '</div>' +
'</div>' 
;

function createAndInsertMessage(id, timestamp,name) {
  // 新しいDOMオブジェクトを生成
  const contents = document.createElement('div');
  contents.innerHTML = MESSAGE_TEMPLATE;
  var messageListElement = document.getElementById('messages'); 
  messageListElement.appendChild(contents);
  contents.setAttribute('id', id);
  contents.setAttribute('name', name);

  // If timestamp is null, assume we've gotten a brand new message.
  // https://stackoverflow.com/a/47781432/4816918
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  contents.setAttribute('timestamp', timestamp);

  const existingMessages = messageListElement.children;

  if (existingMessages.length === 0) {
    messageListElement.appendChild(container);
  } else {
    let messageListNode = existingMessages[0];
    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute('timestamp');
      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }
      // if (messageListNodeTime > timestamp) {
      if (messageListNodeTime < timestamp) {
        break;
      }
      messageListNode = messageListNode.nextSibling;
    }
    messageListElement.insertBefore(contents, messageListNode);
  }
  return contents;
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
async function saveImageMessage(file) {
  // TODO 9: Posts a new image as a message.
  try {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    const messageRef = await addDoc(collection(getFirestore(), 'messages'), {
      name: getUserName(),
      imageUrl: LOADING_IMAGE_URL,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp()
    });

    // 2 - Upload the image to Cloud Storage.
    const filePath = `${getAuth().currentUser.uid}/${messageRef.id}/${file.name}`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    
    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    // 4 - Update the chat message placeholder with the image's URL.
    await updateDoc(messageRef,{
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath
    });
  } catch (error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  }
}

// Saves the messaging device token to Cloud Firestore.
async function saveMessagingDeviceToken() {
  // TODO 10: Save the device token in Cloud Firestore
  try {
    const currentToken = await getToken(getMessaging());
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to Cloud Firestore.
      const tokenRef = doc(getFirestore(), 'fcmTokens', currentToken);
      await setDoc(tokenRef, { uid: getAuth().currentUser.uid });

      // This will fire when a message is received while the app is in the foreground.
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(getMessaging(), (message) => {
        console.log(
          'New foreground notification from Firebase Messaging!',
          message.notification
        );
      });
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  } catch(error) {
    console.error('Unable to get messaging token.', error);
  };
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000,
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = userName;

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    saveMessagingDeviceToken();
  }
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value) {
    saveMessage(messageInputElement.value).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
    });
  }
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var mediaCaptureElement;
var userPicElement;
var signInSnackbarElement;
var teamNum;
var avatorNum;
var userName;

function initApp() {
	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;

      //アバター・背景の表示機構
      var docRef = db.collection("Users").doc(uid);
      docRef.get().then((doc) => {
          if (doc.exists) {
              userName = doc.data().name;
              teamNum = doc.data().teamNumber;
              avatorNum = doc.data().avatorNumber;
              var teamPic = document.getElementById("teamPic");
              teamPic.src = "./images/teampic/" + teamNum + ".jpg";
              var avatorPic = document.getElementById("avatorPic");
              avatorPic.src = "./images/avatorpic/" + avatorNum + ".png";
              teamPic.src = "./images/teampic/" + teamNum + ".jpg";
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
		} else {
			// User is signed out.
			location.href = './index.html';
			toggleSignIn();
		}
	});
  
  messageInputElement =  document.getElementById('message');
	messageFormElement = document.getElementById('submit');
	messageFormElement.addEventListener('click', onMessageFormSubmit, false);
}

window.addEventListener = function() {
	initApp();
};

loadMessages();
