'use strict';

var db = firebase.firestore();
var messagesRef = db.collection("messages");
var teamRef = db.collection("teamPoint");
var userRef = db.collection("Users");

var addDoc;
var i = 0;
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

function loadMessages() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            var userSerchRef = db.collection('Users').doc(uid);
            userSerchRef.get().then((doc) => {
                viewUser = doc.data().view;
                return putOtherUsers(userSerchRef, viewUser);
            })
        }
    })
}

function putOtherUsers(userSerchRef, view) {
    //var viewRef = userSerchRef.collection('messages');
    db.runTransaction((transaction) => {
        return transaction.get(userSerchRef).then((res) => {
            if (!res.exists) {
                throw "処理失敗！";
            }

            db.collection('messages').where('uid', '==', view).orderBy("timestamp", "desc").limit(5).onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    displayMessage(doc.id, doc.data().timestamp, doc.data().name, doc.data().text, '', '', doc.data().uid)
                });
            })
        })
    })
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl, uid) {
    var messageListElement = document.getElementById('messages');

    var div =
        document.getElementById(id) || createAndInsertMessage(id, timestamp, name,uid);
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
        image.addEventListener('load', function() {
            messageListElement.scrollTop = messageListElement.scrollHeight;
        });
        image.src = imageUrl + '&' + new Date().getTime();
        messageElement.innerHTML = '';
        messageElement.appendChild(image);
    }
    // Show the card fading-in and scroll to view the new message.
    setTimeout(function() {
        div.classList.add('visible');
    }, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
    //messageInputElement.focus();
}

// Template for messages.
var MESSAGE_TEMPLATE =

    '<div class="row justify-content-between border-bottom">' +
    '<div class="col-5 d-flex justify-content-start">' +
    '<div class = "trigger"><img id="icons" class="posted-img" src="./images/麻雀女子 3.png" alt="">' +
    '<a href="#" class="align-self-start"><div class="name"></div></a></div>' +
    '</div>' +
    '<div class="col-4 d-flex justify-content-end">' +
    '<div class="date"></div>' +
    '</div>' +
    '<div class="row justify-content-center">' +
    '<div class="col-7 align-self-center">' +
    '<div class="message"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

function createAndInsertMessage(id, timestamp, name,uid) {
    // 新しいDOMオブジェクトを生成
    const contents = document.createElement('div');
    contents.innerHTML = MESSAGE_TEMPLATE;
    var messageListElement = document.getElementById('messages');
    messageListElement.appendChild(contents);
    contents.setAttribute('id', id);
    contents.setAttribute('name', name);
    createPicBox(uid + id);

    //ここがユーザーアイコンの入れどころ

    function createPicBox(subid) {
        var icon = document.getElementById("icons");
        //icon.setAttribute('id', subid); //すべての配列にめぐるように変える
        icon.id = subid;
        userPicOut(subid);
        console.log("投稿ID+UID＝＞" + subid);
        i++;
    }

    function userPicOut(subid) {
        userRef.doc(uid).get().then((doc) => {
            if (doc.exists) {
                var userPic = doc.data().avatorNumber;
                console.log("ハッシュ化された投稿ID+UID＝＞" + subid + "\nアバターID＝＞" + userPic);
                //ここの処理をストレージからの参照に変える
                var iconPics = document.getElementById(subid);
                iconPics.src = './images/iconpic/' + userPic + '.png';



            }
        })
    }
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



// Triggers when the auth state change for instance when the user signs-in or signs-out.
// function authStateObserver(user) {
//     if (user) {
//         // User is signed in!
//         // Get the signed-in user's profile pic and name.
//         var profilePicUrl = getProfilePicUrl();
//         var userName = userName;

//         // Set the user's profile pic and name.
//         userPicElement.style.backgroundImage =
//             'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
//         userNameElement.textContent = userName;

//         saveMessagingDeviceToken();
//     }
// }

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
    element.value = '';
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (messageInputElement.value) {
        saveMessage(messageInputElement.value).then(function() {
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
var lastLoginDay;
var gomicount;
var gomiNum;
var viewUser;

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

    messageInputElement = document.getElementById('message');
    messageFormElement = document.getElementById('submit');
    //messageFormElement.addEventListener('click', onMessageFormSubmit, false);
}

window.addEventListener = function() {
    initApp();
    checkFollow();
};

loadMessages();


//アバター表示
window.onload = function userLoading() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // ユーザーサインイン処理
            var uid = user.uid;
            //アバター・背景の表示機構
            var docRef = db.collection("Users").doc(uid);
            docRef.get().then((doc) => {
                viewUser = doc.data().view;
                var viewRef = db.collection("Users").doc(viewUser);
                viewRef.get().then((doc) => {
                    if (doc.exists) {
                        userName = doc.data().name;
                        teamNum = doc.data().teamNumber;
                        avatorNum = doc.data().avatorNumber;
                        gomiNum = doc.data().gomicount;
                        console.log(doc.data().gomicount);
                        console.log(gomiNum);
                        var othername = document.getElementById("othername");
                        othername.innerHTML = userName;
                        var teamPic = document.getElementById("teamPic");
                        teamPic.src = "./images/teampic/" + teamNum + ".jpg";
                        var avatorPic = document.getElementById("avatorPic");
                        avatorPic.src = "./images/avatorpic/" + avatorNum + ".png";
                        var gomiPicL = document.getElementById("gomiPicL");
                        console.log(gomiPicL);
                        gomiPicL.src = "./images/gomi/" + gomiNum + ".png";
                        var gomiPicR = document.getElementById("gomiPicR");
                        console.log(gomiPicR);
                        gomiPicR.src = "./images/gomi/" + gomiNum + ".png";
                        lastLoginDay = doc.data().lastLoginDay;
                        var myicon = document.getElementById("myicon");
                        myicon.src = "./images/iconpic/"+avatorNum+".png";
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            })

        };
    });

}

//ポイント・ゴミ系
function addPointAndDust() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // ユーザーサインイン処理
            var uid = user.uid;
            var docRef = db.collection("Users").doc(uid);
            //最終ログイン時間、ゴミカウント表示機構
            docRef.update({
                    lastLoginDay: firebase.firestore.FieldValue.serverTimestamp(),
                    gomicount: firebase.firestore.FieldValue.increment(1),
                    creanPoint: firebase.firestore.FieldValue.increment(1)
                })
                .then((docRef) => {
                    //console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    //console.error("Error adding document: ", error);
                });
        } else {
            // User is signed out.
            location.href = './index.html';
            toggleSignIn();
        };
    });
}

//フォローリスト追加・排除
function FollowManager() {
    var followJudge = document.getElementById("follow");
    if (followJudge.textContent == "フォロー") {
        //console.log("フォローしてないね");
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;
                var followRef = db.collection("Users").doc(uid);
                userRef.doc(uid).get().then((doc) => {
                    if (doc.exists) {
                        var followID = doc.data().view;
                        console.log("viewのIDは" + followID);
                        followRef.update({
                            follow: firebase.firestore.FieldValue.arrayUnion(followID)
                        })
                    }
                })
            }
        })
    } else {
        console.log("フォロー中だね");
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;
                var followRef = db.collection("Users").doc(uid);
                userRef.doc(uid).get().then((doc) => {
                    if (doc.exists) {
                        var followID = doc.data().view;
                        console.log("viewのIDは" + followID);
                        followRef.update({
                            follow: firebase.firestore.FieldValue.arrayRemove(followID)
                        })
                        var fs = document.getElementById("follow");
                        fs.innerHTML = "フォロー";

                    }
                })
            }
        })
    }
}
//フォローボタン見た目
async function checkFollow() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            var followSerchRef = userRef.doc(uid);
            userRef.doc(uid).get().then((doc) => {
                var otherUserId = doc.data().view;
                return serchFollow(followSerchRef, otherUserId);
            })
        }
    })
}

function serchFollow(fsRef, checkId) {
    fsRef.get().then((doc) => {
        if (doc.exists) {
            console.log("ここまで来てる");
            db.collection('Users').where('follow', 'array-contains', checkId).onSnapshot((querySnapshot) => {
                console.log("スナップショットには入れているのか");
                querySnapshot.forEach((doc) => {
                    //var followCheck = doc.data().follow;
                    var fs = document.getElementById("follow");
                    //console.log("get内に通っているのか" + followCheck);
                    //console.log("フォロー済み処理到達済み" + followCheck);
                    fs.innerHTML = "フォロー済み";
                });
            })
        } else {
            console.log(フォロー確認失敗);
        }
    })
}