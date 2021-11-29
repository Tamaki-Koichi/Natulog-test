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

window.addEventListener = function() {
    initApp();
};

window.onload = function dispPoint() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var Point = doc.data().creanPoint;
                    var myPoint = document.getElementById("myPoint");
                    myPoint.innerHTML = Point + "ポイント"
                }
            })
        }
    })
}

function changeAvator() {
    var Point;

    var check = window.confirm("100P使用してアバターを変更しますか？");
    if (check) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;
                var charDocRef = db.collection("Users").doc(uid);

                db.runTransaction((transaction) => {
                    return transaction.get(charDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        Point = sfDoc.data().creanPoint;
                        if (Point >= 100) {
                            transaction.update(charDocRef, { creanPoint: firebase.firestore.FieldValue.increment(-100) });
                            console.log("ポイント読み込み" + Point);
                            alert("100Pを消費しました");
                            return Point;
                        } else {
                            alert("ポイントが不足しています。\n沢山投稿してポイントを貯めよう！");
                            location.href = './myroom.html';
                        }
                    });
                }).then((Point) => {
                    location.href = './selectCharactor.html';
                }).catch((err) => {

                });
            };

        });
    }
}

function changeTeam() {
    var Point;

    var check = window.confirm("300P使用してチームを変更しますか？");
    if (check) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;
                var charDocRef = db.collection("Users").doc(uid);

                db.runTransaction((transaction) => {
                    return transaction.get(charDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        Point = sfDoc.data().creanPoint;
                        if (Point >= 100) {
                            transaction.update(charDocRef, { creanPoint: firebase.firestore.FieldValue.increment(-300) });
                            console.log("ポイント読み込み" + Point);
                            alert("300Pを消費しました");
                            return Point;
                        } else {
                            alert("ポイントが不足しています。\n沢山投稿してポイントを貯めよう！");
                            location.href = './myroom.html';
                        }
                    });
                }).then((Point) => {
                    location.href = './selectTeam.html';
                }).catch((err) => {

                });
            };

        });
    }
}

function buyTickets() {
    var Point;

    var check = window.confirm("10P使用してゴミ収集チケットを購入しますか？");
    if (check) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;
                var charDocRef = db.collection("Users").doc(uid);

                db.runTransaction((transaction) => {
                    return transaction.get(charDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        Point = sfDoc.data().creanPoint;
                        if (Point >= 100) {
                            transaction.update(charDocRef, { creanPoint: firebase.firestore.FieldValue.increment(-10) });
                            console.log("ポイント読み込み" + Point);
                            alert("10Pを消費しました");
                            return Point;
                        } else {
                            alert("ポイントが不足しています。\n沢山投稿してポイントを貯めよう！");
                            location.href = './myroom.html';
                        }
                    });
                }).then((Point) => {
                    location.href = './buyTicket.html';
                }).catch((err) => {

                });
            };

        });
    }
}