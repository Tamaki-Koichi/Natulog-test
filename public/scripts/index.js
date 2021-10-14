
// サインアップボタンが押されたら
 function handleSignUp() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	if (email.length < 4) {
		alert('Please enter an email address.');
		return;
	}
	if (password.length < 4) {
		alert('Please enter a password.');
		return;
	}
	// ユーザー登録.
	firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
		location.href = './Transfer.html';
    // ...
  })
	.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/weak-password') {
			alert('The password is too weak.');
		} else {
			alert(errorMessage);
		}
		console.log(error);
	});
		// location.href = './Transfer.html';
}


// サインイン処理
function toggleSignIn() {
	if (firebase.auth().currentUser) {
		firebase.auth().signOut();
	} else {
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;
		if (email.length < 4) {
			alert('Please enter an email address.');
			return;
		}
		if (password.length < 4) {
			alert('Please enter a password.');
			return;
		}
		// ログイン.
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
			document.getElementById('quickstart-sign-in').disabled = false;
		});
	}
	document.getElementById('quickstart-sign-in').disabled = true;
}

 /**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */

function initApp() {
	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {
		document.getElementById('quickstart-verify-email').disabled = true;
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			document.getElementById('quickstart-sign-in').textContent = 'サインアウト';
			location.href = './myroom.html';
			stringify(user, null, '  ');
			if (!emailVerified) {
				document.getElementById('quickstart-verify-email').disabled = false;
			}
		} else {
			// User is signed out.
			document.getElementById('quickstart-sign-in').textContent = 'サインイン';
		}
		document.getElementById('quickstart-sign-in').disabled = false;
	});

	document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}

window.addEventListener = function() {
	initApp();
};

// ログアウト処理
function logout() {
  firebase.auth().onAuthStateChanged(function(user){
    firebase.auth().signOut().then(()=>{
				location.href = './index.html';
				toggleSignIn();
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  });
}

// // メッセージのやり取り
// const firebaseApp = initializeApp(getFirebaseConfig());
// getMessaging(firebaseApp);
// console.info('Firebase messaging service worker is set up');

// トランスファー画面の切り替え
function loc() {
	window.location = "./1stTransferred.html";
}
function tm(){
	tm = setTimeout("loc()",10000);
}

window.onpageshow = function(event) {
	if (event.persisted) {
		 window.location.reload();
	}
};

// function onunload() {
// 	alert('Back buttom is pushed ??');
// 	location.replace(document.location);
// 	}; 