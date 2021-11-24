'use strict';

var db = firebase.firestore();
var messagesRef = db.collection("tl");

db.collection("tl").onSnapshot((querySnapshot) => {
    var text = [];
    querySnapshot.forEach((doc) => {
        text.push(doc.data().text);
    });
    loadMessages();
});

// Template for messages.
var MESSAGE_TEMPLATE =

    '<div class="row justify-content-between border-bottom">' +
    '<div class="col-8 d-flex justify-content-start">' +
    '<img class="posted-img" src="./images/麻雀女子 3.png" alt="">' +
    '<div class="align-self-start"><p class="name"></p></div>' +
    '</div>' +
    '<div class="col-4 d-flex justify-content-end">' +
    '<div class="date"></div>' +
    '</div>' +
    '<div class="row justify-content-center">' +
    '<div class="col align-self-center">' +
    '<div class="message"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

function showmessage(id, timestamp, name) {
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
    // name = ;

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

function loadMessages() {
    // if(){
    messagesRef.orderBy("timestamp", "desc").limit(5)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                displayMessage(doc.id, doc.data().timestamp, doc.data().name, doc.data().text, '', '')
            });
        })
        // }
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
    var messageListElement = document.getElementById('messages');

    var div =
        document.getElementById(id) || showmessage(id, timestamp, name);
    // document.getElementById(id);
    console.log(div);
    // profile picture
    if (picUrl) {
        div.querySelector('.pic').style.backgroundImage =
            'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
    }

    const myToDated = timestamp.toDate();
    div.querySelector('.date').textContent = dateFns.format(myToDated, "MM/DD(ddd) hh:mm");

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
}


var teamRef = db.collection("teamPoint");
window.onload = function toprank() {
    //陸ランク出力
    teamRef.doc("1").get().then((doc) => {
        if (doc.exists) {
            var rikuPoint = doc.data().point;
            console.log(rikuPoint);
            teamRef.doc("2").get().then((doc) => {
                if (doc.exists) {
                    var umiPoint = doc.data().point;
                    console.log(umiPoint);
                    teamRef.doc("3").get().then((doc) => {
                        var soraPoint = doc.data().point;
                        console.log(soraPoint);
                        var rikuscore = document.getElementById("rikuscore");
                        rikuscore.innerHTML = "ポイント：" + rikuPoint + "|" + rank(rikuPoint, [rikuPoint, umiPoint, soraPoint], 0) + "位";
                        //背景色変更if文 
                        if(rank(rikuPoint, [rikuPoint, umiPoint, soraPoint], 0) == 1){
                            document.getElementById('riku').style.backgroundColor = 'skyblue';
                        }
                    })
                }
            })
        }
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
    //海ランク出力
    teamRef.doc("1").get().then((doc) => {
        if (doc.exists) {
            var rikuPoint = doc.data().point;
            console.log(rikuPoint);
            teamRef.doc("2").get().then((doc) => {
                if (doc.exists) {
                    var umiPoint = doc.data().point;
                    console.log(umiPoint);
                    teamRef.doc("3").get().then((doc) => {
                        var soraPoint = doc.data().point;
                        console.log(soraPoint);
                        var umiscore = document.getElementById("umiscore");
                        umiscore.innerHTML = "ポイント：" + umiPoint + "|" + rank(umiPoint, [rikuPoint, umiPoint, soraPoint], 0) + "位";
                        //背景色変更if文
                        if(rank(umiPoint, [rikuPoint, umiPoint, soraPoint], 0) == 1){
                            document.getElementById('umi').style.backgroundColor = 'skyblue';
                        }
                    })
                }
            })
        }
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
    //空ランク出力
    teamRef.doc("1").get().then((doc) => {
        if (doc.exists) {
            var rikuPoint = doc.data().point;
            console.log(rikuPoint);
            teamRef.doc("2").get().then((doc) => {
                if (doc.exists) {
                    var umiPoint = doc.data().point;
                    console.log(umiPoint);
                    teamRef.doc("3").get().then((doc) => {
                        var soraPoint = doc.data().point;
                        console.log(soraPoint);
                        var sorascore = document.getElementById("sorascore");
                        sorascore.innerHTML = "ポイント：" + soraPoint + "|" + rank(soraPoint, [rikuPoint, umiPoint, soraPoint], 0) + "位";
                        //背景色変更if文 
                        if(rank(soraPoint, [rikuPoint, umiPoint, soraPoint], 0) == 1){
                            document.getElementById('sora').style.backgroundColor = 'skyblue';
                        }
                    })
                }
            })
        }
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

//拾ってきたランク関数
//alert(rank(20, [20, 40, 40, 10, 50], 1); ランク出力の例、これでは2が表示される
function rank(value, arrs, updown) {
    var i, thisrank, array_length, sign;
    if (typeof(updown) == "undefined") {
        updown = 0;
    }
    sign = updown == 0 ? 1 : -1;
    thisrank = 1;
    array_length = arrs.length;
    for (i = 0; i < array_length; i++) {
        if (sign * (arrs[i] - value) > 0) {
            thisrank++;
        }
    }
    return thisrank;
}