'use strict';

var db = firebase.firestore();
var messagesRef = db.collection("messages");
var teamRef = db.collection("teamPoint");
var docRef = db.collection("Users");
var addDoc;

// ログアウト処理
function logout() {
    firebase.auth().onAuthStateChanged(function(user) {
        firebase.auth().signOut().then(() => {
                location.href = './signin.html';
                toggleSignIn();
            })
            .catch((error) => {
                console.log(`ログアウト時にエラーが発生しました (${error})`);
            });
    });
}
//ログインしているかどうかの処理なのかな？？
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

            const users = firebase.auth().currentUser;

            if (users !== null) {
                users.providerData.forEach((profile) => {
                    console.log("Sign-in provider: " + profile.providerId);
                    console.log("  Provider-specific UID: " + profile.uid);
                    console.log("  Name: " + profile.displayName);
                    console.log("  Email: " + profile.email);
                    console.log("  Photo URL: " + profile.photoURL);
                });
            }

        } else {
            // User is signed out.
            location.href = './index.html';
            toggleSignIn();
        }

    });
}
window.onload = function() {
    initApp();
};

//キャラクター選択分岐
function selectT1() {
    var check = window.confirm("陸の民に転生しますか？");
    if (check) {
        location.href = "./teamTransfer/t1.html";
    }
}

function selectT2() {
    var check = window.confirm("海の民に転生しますか？");
    if (check) {
        location.href = "./teamTransfer/t2.html";
    }
}

function selectT3() {
    var check = window.confirm("空の民に転生しますか？");
    if (check) {
        location.href = "./teamTransfer/t3.html";
    }
}