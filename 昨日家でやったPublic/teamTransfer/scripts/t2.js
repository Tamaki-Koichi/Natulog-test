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
}

window.addEventListener = function() {
    initApp();
};

function select() {
    var avatorNum;
    var teamNum = 2;
    console.log(teamNum);
    if (teamNum == 1) {
        avatorNum = Math.floor(Math.random() * (9 - 4)) + 4;
        console.log();
    } else if (teamNum == 2) {
        avatorNum = Math.floor(Math.random() * (14 - 9)) + 9;
        console.log(avatorNum);
    } else {
        avatorNum = Math.floor(Math.random() * (19 - 14)) + 14;
        console.log(avatorNum);
    }
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
                    avatorName = 'クジャク';
                    break;
                case 17:
                    avatorName = 'インコ';
                    break;
                case 18:
                    avatorName = 'トンビ';
                    break;
            }
    }
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("Users");
            docRef.doc(uid).update({
                teamNumber: teamNum,
                team: teamName,
                avatorNumber: avatorNum,
                avator: avatorName
            })
        } else {
            console.log('uid取得失敗');
            //サインインできていないので登録画面に戻すようにしようかと
        }
    });
    var teamPic = document.getElementById("teamPic");
    teamPic.src = "../images/teampic/" + teamNum + ".jpg";
    var avatorPic = document.getElementById("avatorPic");
    avatorPic.src = "../images/avatorpic/" + avatorNum + ".png";
    var transResult = document.getElementById("transResult");
    transResult.innerHTML = `あなたは、${teamName}の${avatorName}に転生しました。`;

}

window.addEventListener = function() {
    initApp();
};