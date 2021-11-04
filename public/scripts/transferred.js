'use strict';

var db = firebase.firestore();

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
};



function select() {
    var avatorNum;
    var teamNum = Math.floor(Math.random() * (4 - 1)) + 1;
    //チームとアバターを乱数で割り振っている
    console.log(teamNum);
    if (teamNum == 1) {
        avatorNum = Math.floor(Math.random() * (9 - 4)) + 4;
        console.log();
    } else if (teamNum == 2) {
        avatorNum = Math.floor(Math.random() * (14 - 9)) + 9;
        console.log(avatorNum);
    } else {
        avatorNum = Math.floor(Math.random() * (20 - 14)) + 14;
        console.log(avatorNum);
    }
    //出来ればこの辺の名前とかもFireStoreに入れて呼び出せたら便利だなって思ってます！


    //チームとアバターの名前を呼び出している
    var teamName;
    var avatorName;

    switch (teamNum) {
        case 1:
            teamName = '陸の民';
            switch (avatorNum) {
                case 4:
                    avatorName = 'ビッグフット';
                    break;
                case 5:
                    avatorName = 'ブタ';
                    break;
                case 6:
                    avatorName = 'ネコ';
                    break;
                case 7:
                    avatorName = 'イヌ';
                    break;
                case 8:
                    avatorName = 'ライオン';
            }
            break;
        case 2:
            teamName = '海の民';
            switch (avatorNum) {
                case 9:
                    avatorName = 'イルカ';
                    break;
                case 10:
                    avatorName = '半魚人';
                    break;
                case 11:
                    avatorName = 'カクレクマノミ';
                    break;
                case 12:
                    avatorName = 'タツノオトシゴ';
                    break;
                case 13:
                    avatorName = 'タコ';
            }
            break;
        case 3:
            teamName = '空の民';
            switch (avatorNum) {
                case 14:
                    avatorName = 'ドラゴン';
                    break;
                case 15:
                    avatorName = 'フラミンゴ';
                    break;
                case 16:
                    avatorName = 'ハト';
                    break;
                case 17:
                    avatorName = 'クジャク';
                    break;
                case 18:
                    avatorName = 'インコ';
                    break;
                case 19:
                    avatorName = 'トンビ';
            }
    }
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            console.log(teamName);
            console.log(avatorName);
            console.log('uid取得完了');

            var docRef = db.collection("Users").doc(uid);
            docRef.set({
                    user: null,
                    teamNumber: teamNum,
                    team: teamName,
                    avatorNumber: avatorNum,
                    avator: avatorName,
                    timestamp: firebase.firestore.Timestamp.fromDate(new Date())
                })
                //ここまで
                .then((docRef) => {
                    //console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    //console.error("Error adding document: ", error);
                });

        } else {
            console.log('uid取得失敗');
        }
    });
    var teamPic = document.getElementById("teamPic");
    teamPic.src = "./images/teampic/" + teamNum + ".jpg";
    var avatorPic = document.getElementById("avatorPic");
    avatorPic.src = "./images/avatorpic/" + avatorNum + ".png";
    var transResult = document.getElementById("transResult");
    transResult.innerHTML = `あなたは、${teamName}の${avatorName}に転生しました！`;



};

function userNameUpdate() {
    const userName = document.getElementsByName('name')[0].value; //ユーザー名をテキストボックスから取得
    console.log(userName);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("Users").doc(uid);
            docRef.update({
                    user: userName,
                })
                .then((docRef) => {
                    //console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    //console.error("Error adding document: ", error);
                });
        } else {
            console.log('uid取得失敗');
        }
    });
    window.Location = "myroom.html";
}
window.addEventListener = function() {
    initApp();
};