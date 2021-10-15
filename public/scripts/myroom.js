var messageListElement;
var messageFormElement;
var messageInputElement;
var submitButtonElement;
var imageFormElement;
var mediaCaptureElement;
var userPicElement;
var userNameElement;
var signInButtonElement;
var signOutButtonElement;
var signInSnackbarElement;


function initApp() {
	console.log('initApp()');
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
		} else {
			// User is signed out.
			location.href = './index.html';
			toggleSignIn();
		}
	});
// 	document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);

	messageInputElement =  document.getElementById('message');
	messageInputElement.addEventListener('keyup', toggleButton);

	messageInputElement.addEventListener('change', toggleButton);

	messageFormElement = document.getElementById('submit');
	messageFormElement.addEventListener('click', onMessageFormSubmit, false);


// 	document.getElementById('keyup').addEventListener('click', toggleButton, false);
// 	// console.log('initApp');
// 
}

window.addEventListener = function() {
	initApp();
};


// ログアウト処理
function logout() {
  firebase.auth().onAuthStateChanged(function(user){
    firebase.auth().signOut().then(()=>{
			// サインアウト
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  });
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
	console.log('toggleButton()');
  if (messageInputElement.value) {
    messageFormElement.removeAttribute('disabled');
  } else {
    messageFormElement.setAttribute('disabled', 'true');
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value) {
    saveMessage(messageInputElement.value).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Saves a new message on the Cloud Firestore.
async function saveMessage(messageText) {
  // TODO 7: Push a new message to Cloud Firestore.
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), 'messages'), {
      name: getUserName(),
      text: messageText,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp()
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}