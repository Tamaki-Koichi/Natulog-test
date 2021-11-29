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
    var avatorNum = 18;
    var teamNum = 3;
    var avatorName = "インコ";
    var teamName = "空の民";
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;

            var docRef = db.collection("Users");
            docRef.doc(uid).update({
                teamNumber: teamNum,
                team: teamName,
                avatorNumber: avatorNum,
                avator: avatorName,
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