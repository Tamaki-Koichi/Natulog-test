'use strict';

var db = firebase.firestore();
var docRef = db.collection("Users");

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

window.addEventListener = function() {
    initApp();

};



window.onload = function() {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("タイミングずらし");
            var uid = user.uid;
            docRef.doc(uid).update({
                creanTickets: firebase.firestore.FieldValue.increment(1)
            });
        }
    })
    cancelIdleCallback(dispTickets());
}

async function dispTickets() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var creanTickets = doc.data().creanTickets;
                    var hwihv = document.getElementById("hwihv");
                    hwihv.innerHTML = `チケット所持数 ${creanTickets}枚`;
                }
            })
        }
    })
}

function goBackRoom() {
    location.href = './myroom.html';
}

function useTicket() {
    location.href = './usingTicket.html';
}