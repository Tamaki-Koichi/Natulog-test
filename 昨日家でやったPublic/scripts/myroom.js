'use strict';

var db = firebase.firestore();
var storageRef = firebase.storage().ref();
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
async function saveMessage(messageText) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // ユーザーサインイン処理
            var uid = user.uid;
            db.collection("messages").doc().set({
                    name: userName,
                    text: messageText,
                    timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                    uid: uid
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
                var docRef = db.collection("Users").doc(uid);
                //投稿時ポイント加算
                docRef.update({
                    creanPoint: firebase.firestore.FieldValue.increment(1)
                })
                .then((docRef) => {
                    //console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    //console.error("Error adding document: ", error);
                });
            //ポイント加算確認
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log(doc.data().creanPoint);
                    var myTeamNumber = doc.data().teamNumber;
                    if (myTeamNumber == 1) {
                        teamRef.doc("1").update({
                            point: firebase.firestore.FieldValue.increment(1)
                        })
                    } else if (myTeamNumber == 2) {
                        teamRef.doc("2").update({
                            point: firebase.firestore.FieldValue.increment(1)
                        })
                    } else if (myTeamNumber == 3) {
                        teamRef.doc("3").update({
                            point: firebase.firestore.FieldValue.increment(1)
                        })
                    }
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
        };
    });
}
async function saveImageAndMessage(messageText, file) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // ユーザーサインイン処理
            var uid = user.uid;
            db.collection("messages").doc().set({
                name: userName,
                imageUrl: LOADING_IMAGE_URL,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                text: messageText,
                uid: uid,
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            var docRef = db.collection("Users").doc(uid);
            //投稿時ポイント加算
            docRef.update({
                creanPoint: firebase.firestore.FieldValue.increment(1)
            })
            .then((docRef) => {
                //console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                //console.error("Error adding document: ", error);
            });
            //ポイント加算確認
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log(doc.data().creanPoint);
                    var myTeamNumber = doc.data().teamNumber;
                    if (myTeamNumber == 1) {
                        teamRef.doc("1").update({
                            point: firebase.firestore.FieldValue.increment(1)
                        })
                    } else if (myTeamNumber == 2) {
                        teamRef.doc("2").update({
                            point: firebase.firestore.FieldValue.increment(1)
                        })
                    } else if (myTeamNumber == 3) {
                        teamRef.doc("3").update({
                            point: firebase.firestore.FieldValue.increment(1)
                        })
                    }
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
        };
        //ファイルのメタデータ
        var metadata = {
            contentType: file.type
        };
    
    // var fileSnapshot = null;
    var publicImageUrl = null;

    storageRef.child('images/' + file.name).put(file, metadata)
    .then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);

        // 3 - Generate a public URL for the file.
        // const publicImageUrl = getDownloadURL(newImageRef);
        snapshot.ref.getDownloadURL().then(function(url) {
            publicImageUrl = url;     
            console.log('File available at', url);
        })
    })
            db.collection("tl").set({
            imageUrl: publicImageUrl,
            // imageUrl: url,
            storageUri: storageRef.child('images/' + file.name)
        }),{merge: true}.then(() => {
            console.log("Document successfully updated!");
        }).catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            // location.href = './uploadImg.html';
        })
    .catch(function(error) {
        // Handle any errors
    });
})
}


function loadMessages(uid) {
    userRef.doc(uid).get().then((doc) => {
        var followUser = doc.data().follow;
        console.log(uid);
        for (var j = 0; j < followUser.length; j++) {
            console.log(followUser[j]);
            messagesRef.where("uid", "==", followUser[j]).orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    displayMessage(doc.id, doc.data().timestamp, doc.data().name, doc.data().text, '', doc.data().imageUrl, doc.data().uid)
                    console.log("確認" + doc.id);
                });
            })
        }
    })
}


// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl, uid) {
    console.log
    var messageListElement = document.getElementById('messages');

    var div =
        document.getElementById(id) || createAndInsertMessage(id, timestamp, name,imageUrl, uid);
    console.log(div);
    const trigger = document.getElementById(id);
    trigger.onclick = getOtherUser;

    function getOtherUser() {
        console.log("もしかしてお前さん、、、呼ばれてないのに動いているのかい？")
        var OtherId = uid;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var myuid = user.uid;
                console.log("myId:" + myuid);
                console.log("otherId:" + OtherId);
                userRef.doc(myuid).update({
                    view: OtherId
                })
            }
        })
        setTimeout(function() { location.href = "./otheruserroom.html" }, 1000);
    }
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
        var imageElement = div.querySelector('.img');
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
    '<div class="holdImage"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

function createAndInsertMessage(id, timestamp, name, imageUrl,uid) {
    // 新しいDOMオブジェクトを生成
    const contents = document.createElement('div');
    contents.innerHTML = MESSAGE_TEMPLATE;
    var messageListElement = document.getElementById('messages');
    messageListElement.appendChild(contents);
    contents.setAttribute('id', id);
    contents.setAttribute('name', name);
    contents.setAttribute('img', imageUrl);
    createPicBox(uid + id);

    if(imageUrl !== undefined){
        var image = document.createElement('img');
        image.src = imageUrl;
        // console.log(contents.querySelector('.holdImage'));
        contents.querySelector('.holdImage').appendChild(image);
        // console.log(imageUrl);
    }

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

async function saveImageMessage(file) {
    // TODO 9: Posts a new image as a message.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
             // 1 - We add a message with a loading icon that will get updated with the shared image.
            var uid = user.uid;
            // var document;
            //ファイルのメタデータ
            var metadata = {
                contentType: file.type
            };

            // var fileSnapshot = null;
            var publicImageUrl = null;
            // console.log(subuid);
            var messagesRef = db.collection("messages");
            messagesRef.add({
                name: userName,
                imageUrl: LOADING_IMAGE_URL,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                uid: uid
            }).then((docRef) => {
                // document = docRef.id;
                console.log("Document written with ID: ", docRef.id);
                // messagesRef = docRef;
                storageRef.child('images/' + file.name).put(file, metadata)
                .then(function(snapshot) {
                    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
                    console.log('File metadata:', snapshot.metadata);
    
                    // 3 - Generate a public URL for the file.
                    // const publicImageUrl = getDownloadURL(newImageRef);
                    snapshot.ref.getDownloadURL().then(function(url) {
                        publicImageUrl = url;     
                        console.log('File available at', url);
                        console.log(publicImageUrl);
                    })
                    .then(function(){
                        console.log(db.collection("messages"));
                        db.collection("messages").doc(docRef.id).update({
                            imageUrl: publicImageUrl
                        })
                    })
                    .then(function(){
                        db.collection("messages").doc(docRef.id).set({
                            storageUri: storageRef.child('images/' + file.name)
                        })
                        ,{merge: true}.then(() => {
                            console.log("Document successfully updated!");
                        })
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.log("Error updating document: ", error);
                    })
                .catch((error) => {
                // The document probably doesn't exist.
                console.log("Error updating document: ", error);
                });
                })
                .catch(function(error) {
                    // Handle any errors
                });
            })
        }   
    })
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
    } catch (error) {
        console.error('Unable to get messaging token.', error);
    };
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
// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    if(!messageInputElement.value && !imageInputElement) {
        alert('コメントを入力するか、ファイルを選択してください。');
    } else if (messageInputElement.value && imageInputElement){
        saveImageAndMessage(messageInputElement.value, imageInputElement).then(function(){
                // Clear image-preview field .
                resetMaterialTextfield(messageInputElement);
                imagepreviewElement.src = '';
                imageInputElement.innerHTML = '';
                console.log(imageInputElement);
        }).then(function(){
            setTimeout(function(){location.href = './uploadImg.html';}, 5000);
        })
    } else if(messageInputElement.value){
        saveMessage(messageInputElement.value).then(function() {
            // Clear message text field and re-enable the SEND button.
            resetMaterialTextfield(messageInputElement);
        })
    } else if(imageInputElement) {
        saveImageMessage(imageInputElement).then(function(){
            // Clear image-preview field .
            imagepreviewElement.src = '';
            imageInputElement.innerHTML = '';
        }).then(function(){
            setTimeout(function(){location.href = './uploadImg.html';}, 5000);
        })
        console.log(imageInputElement);
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
var userPicElement;
var signInSnackbarElement;
var teamNum;
var avatorNum;
var userName;
var lastLoginDay;
var gomicount;
var gomiNum;

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
    messageFormElement.addEventListener('click', onMessageFormSubmit, false);
}

window.addEventListener = function() {
    initApp();

};

//ココがかなり怪しい、おそらくmyroomはtlに比べてDOMの出力の仕方に癖があるからそのせいで上手く発火していない
//mediaCaptureElement.addEventListener('change', onMediaFileSelected);


//アバター表示
window.onload = function userLoading() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // ユーザーサインイン処理
            var uid = user.uid;
            loadMessages(uid);
            //アバター・背景の表示機構
            var docRef = db.collection("Users").doc(uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    userName = doc.data().name;
                    teamNum = doc.data().teamNumber;
                    avatorNum = doc.data().avatorNumber;
                    gomiNum = doc.data().gomicount;
                    console.log(doc.data().gomicount);
                    console.log(gomiNum);
                    var myname = document.getElementById("myname");
                    myname.innerHTML = userName;
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