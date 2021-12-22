'use strict';

var db = firebase.firestore();

function switchName(){
    firebase.auth().onAuthStateChanged(function(user){
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("Users").doc(uid);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    var userName = doc.data().name;
                    var showName = document.getElementById('show-name');
                    showName.innerHTML = userName;
                }

            });
        } else {
            console.log('uid取得失敗');
        }
    });
}

switchName();

function userNameUpdate() {
    const userName = document.getElementsByName('name')[0].value; //ユーザー名をテキストボックスから取得
    console.log(userName);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("Users").doc(uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var userName = doc.data().name;
                }
            });
            if(window.confirm('would you like to change your name to ' + userName + ' ?')){
                alert('name has changed');
                docRef.update({
                    name: userName,
                })
            } else {
                alert('Cancelled');
            }
            var showName = document.getElementById('show-name');
            showName.innerHTML = userName;
        } else {
            console.log('uid取得失敗');
        }
    });
}

function userPasswordUpdate() {
    const newPassword = document.getElementsByName('password')[0].value;
    console.log(newPassword);

    // ログイン画面に遷移,ログインしてcredentialを取得
    if(window.confirm('would you like to change your password ?')){
        function sample() {
            var email = prompt("Email", "your email");
            var password = prompt("Password", "your password");
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((credential) => {
                // Signed in
                var user = credential.user;
                console.log(user);
                return user;
            }).then(() => {

            })
        }
        sample();
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential("email", "password");
        user.reauthenticateWithCredential(credential)
         .then(()=> {
          console.log("再認証完了");
         })
         .catch((error)=> {
            console.log(error);
        })
         //メールアドレス更新
          .then(() =>{
             const user = firebase.auth().currentUser;
             user.updatePassword(newPassword).then(()=> {
                 alert("password has changed");
             })
          .catch((error)=> {
                 console.log(error);
             })
          })
    } else {
        alert('Cancelled');
    }
}

var imageInputElement;

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
    // event.preventDefault();

    var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.getElementById('preview').src = fileReader.result;
	});
	fileReader.readAsDataURL(event.files[0]);

    var file = event.files[0];
    imageInputElement = file;
    console.log(imageInputElement);

    // Check if the file is an image.
    if (!file.type.match('image.*')) {
        var data = {
            message: 'You can only share images',
            timeout: 2000,
        };
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return;
    }
}

var imagepreviewElement = document.getElementById('preview');


function previewImage(obj)
{
	var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.getElementById('preview').src = fileReader.result;
	});
	fileReader.readAsDataURL(obj.files[0]);
}

console.log(previewImage());