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

window.onload = async function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var creanTickets = doc.data().creanTickets;
                    var hwihv = document.getElementById("hwihv");
                    hwihv.innerHTML = ` ${creanTickets}枚`;
                }
            })
        }
    })
}

function useTickets() {
    var Tickets;
    var Gomi;
    var check = window.confirm('チケットを１枚使用してゴミを回収しますか？');
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
                        Tickets = sfDoc.data().creanTickets;
                        Gomi = sfDoc.data().gomicount;
                        if (Tickets >= 1) {
                            transaction.update(charDocRef, { creanTickets: firebase.firestore.FieldValue.increment(-1), gomicount: 0 });
                            console.log("チケット読み込み" + Tickets);
                            console.log("ゴミ確認" + Gomi);
                            alert("チケットを１枚使用してゴミを回収しました。");
                            return Point;
                        } else {
                            alert("チケットが不足しています。\nポイントを利用してチケットを購入しよう！");
                            location.href = './shop.html';
                        }
                    });
                }).then((Point) => {
                    location.href = './usingTicket.html';
                }).catch((err) => {

                });
            };

        });

    }
    setTimeout(function() {
        location.href = './myroom.html';
    }, 5000);

}