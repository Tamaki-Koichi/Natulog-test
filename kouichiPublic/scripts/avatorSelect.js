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
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var Point = doc.data().creanPoint;
                    console.log(Point + "ポイント");
                }
            })
        } else {
            console.log("確認できません");
        }
    })
};

window.onload = function dispPoint() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var myTeamNum = doc.data().teamNumber;
                    if (myTeamNum == 1) {
                        var avator1 = document.getElementById("avator1");
                        avator1.src = "./images/avatorpic/4.png";
                        var avator2 = document.getElementById("avator2");
                        avator2.src = "./images/avatorpic/5.png";
                        var avator3 = document.getElementById("avator3");
                        avator3.src = "./images/avatorpic/6.png";
                        var avator4 = document.getElementById("avator4");
                        avator4.src = "./images/avatorpic/7.png";
                        var avator5 = document.getElementById("avator5");
                        avator5.src = "./images/avatorpic/8.png";
                    } else if (myTeamNum == 2) {
                        var avator1 = document.getElementById("avator1");
                        avator1.src = "./images/avatorpic/9.png";
                        var avator2 = document.getElementById("avator2");
                        avator2.src = "./images/avatorpic/10.png";
                        var avator3 = document.getElementById("avator3");
                        avator3.src = "./images/avatorpic/11.png";
                        var avator4 = document.getElementById("avator4");
                        avator4.src = "./images/avatorpic/12.png";
                        var avator5 = document.getElementById("avator5");
                        avator5.src = "./images/avatorpic/13.png";
                    } else if (myTeamNum == 3) {
                        var avator1 = document.getElementById("avator1");
                        avator1.src = "./images/avatorpic/14.png";
                        var avator2 = document.getElementById("avator2");
                        avator2.src = "./images/avatorpic/15.png";
                        var avator3 = document.getElementById("avator3");
                        avator3.src = "./images/avatorpic/16.png";
                        var avator4 = document.getElementById("avator4");
                        avator4.src = "./images/avatorpic/17.png";
                        var avator5 = document.getElementById("avator5");
                        avator5.src = "./images/avatorpic/18.png";
                        var avator6 = document.getElementById("avator6");
                        avator6.src = "./images/avatorpic/19.png";
                    }
                }
            })
        }
    })
    const check = false;
    let form = document.forms[0];
    let image = form.image;
    console.log(image);
    //「送信」ボタン取得
    let submit = form.submit;

    //「送信」ボタンがクリックされたら
    submit.addEventListener('click', () => {

        //ラジオボタンの数分繰り返し処理
        for (let i = 0; i < image.length; i++) {
            //ラジオボタンがチェック状態であれば
            if (image[i].checked) {
                //コンソールに値を出力する
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) { //この階層まではconsole.logが動いている
                        var uid = user.uid;
                        console.log(uid);
                        docRef.doc(uid).get().then((doc) => {
                            if (doc.exists) {
                                var myTeamNum = doc.data().teamNumber;
                                console.log("ここが読み込まれていたら言って！" + myTeamNum);
                                if (myTeamNum == 1) {
                                    if (i == 0) {
                                        docRef.doc(uid).update({
                                            avator: 'ビッグフット',
                                            avatirNumber: 4
                                        });
                                        console.log(i);
                                    } else if (i == 1) {
                                        docRef.doc(uid).update({
                                            avator: 'ブタ',
                                            avatirNumber: 5
                                        });
                                        console.log(i);
                                    } else if (i == 2) {
                                        docRef.doc(uid).update({
                                            avator: 'ネコ',
                                            avatirNumber: 6
                                        });
                                        console.log(i);
                                    } else if (i == 3) {
                                        docRef.doc(uid).update({
                                            avator: 'イヌ',
                                            avatirNumber: 7
                                        });
                                        console.log(i);
                                    } else if (i == 4) {
                                        docRef.doc(uid).update({
                                            avator: 'ライオン',
                                            avatirNumber: 8
                                        });
                                        console.log(i);
                                    }
                                } else if (myTeamNum == 2) {
                                    if (i == 0) {
                                        docRef.doc(uid).update({
                                            avator: 'イルカ',
                                            avatirNumber: 9
                                        });
                                        console.log(i);
                                    } else if (i == 1) {
                                        docRef.doc(uid).update({
                                            avator: '半魚人',
                                            avatirNumber: 10
                                        });
                                        console.log(i);
                                    } else if (i == 2) {
                                        docRef.doc(uid).update({
                                            avator: 'カクレクマノミ',
                                            avatirNumber: 11
                                        });
                                        console.log(i);
                                    } else if (i == 3) {
                                        docRef.doc(uid).update({
                                            avator: 'タツノオトシゴ',
                                            avatirNumber: 12
                                        });
                                        console.log(i);
                                    } else if (i == 4) {
                                        docRef.doc(uid).update({
                                            avator: 'タコ',
                                            avatirNumber: 13
                                        });
                                        console.log(i);
                                    }
                                } else if (myTeamNum == 3) {
                                    if (i == 0) {
                                        docRef.doc(uid).update({
                                            avator: 'ドラゴン',
                                            avatirNumber: 14
                                        });
                                        console.log(i);
                                    } else if (i == 1) {
                                        docRef.doc(uid).update({
                                            avator: 'フラミンゴ',
                                            avatirNumber: 15
                                        });
                                        console.log(i);
                                    } else if (i == 2) {
                                        docRef.doc(uid).update({
                                            avator: 'ハト',
                                            avatirNumber: 16
                                        });
                                        console.log(i);
                                    } else if (i == 3) {
                                        docRef.doc(uid).update({
                                            avator: 'クジャク',
                                            avatirNumber: 17
                                        });
                                        console.log(i);
                                    } else if (i == 4) {
                                        docRef.doc(uid).update({
                                            avator: 'インコ',
                                            avatirNumber: 18
                                        });
                                        console.log(i);
                                    } else if (i == 5) {
                                        docRef.doc(uid).update({
                                            avator: トンビ,
                                            avatirNumber: 19
                                        });
                                        console.log(i);
                                    }
                                }
                                check = true;
                            }
                            console.log("認識されてる？！本当に？！");
                        })
                        console.log("ここは認識されてる？" + i);
                    }
                })

                console.log("認識されたvalueは" + i);

            }
        }

        if (check == true) {
            location.href = 'selectTrance.html';
        } else {
            location.href = 'selectCharactor.html';
        }
    }, false);

}