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
};

function selectAvator() {
    var way = document.choiceAvator.image;
    console.log(way);
    for (var i = 0; i < way.length; i++) {
        if (way[i].checked) {
            if (i == 0) {
                select1();
            } else if (i == 1) {
                select2();
            } else if (i == 2) {
                select3();
            } else if (i == 3) {
                select4();
            } else if (i == 4) {
                select5();
            }
        }
    }
}
//画像出力
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
                        }
                    }
                })
            }
        })
    }
    //キャラクター選択分岐
function select1() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var myTeamNum = doc.data().teamNumber;
                    if (myTeamNum == 1) {
                        var check = window.confirm("ビッグフットに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC4.html";
                        }
                    } else if (myTeamNum == 2) {
                        var check = window.confirm("イルカに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC9.html";
                        }
                    } else if (myTeamNum == 3) {
                        var check = window.confirm("ドラゴンに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC14.html";
                        }
                    }
                }
            })
        }
    })
}

function select2() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var myTeamNum = doc.data().teamNumber;
                    if (myTeamNum == 1) {
                        var check = window.confirm("ブタに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC5.html";
                        }
                    } else if (myTeamNum == 2) {
                        var check = window.confirm("半魚人に転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC10.html";
                        }
                    } else if (myTeamNum == 3) {
                        var check = window.confirm("フラミンゴに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC15.html";
                        }
                    }
                }
            })
        }
    })
}

function select3() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var myTeamNum = doc.data().teamNumber;
                    if (myTeamNum == 1) {
                        var check = window.confirm("ネコに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC6.html";
                        }
                    } else if (myTeamNum == 2) {
                        var check = window.confirm("カクレクマノミに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC11.html";
                        }
                    } else if (myTeamNum == 3) {
                        var check = window.confirm("クジャクに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC16.html";
                        }
                    }
                }
            })
        }
    })
}

function select4() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var myTeamNum = doc.data().teamNumber;
                    if (myTeamNum == 1) {
                        var check = window.confirm("イヌに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC7.html";
                        }
                    } else if (myTeamNum == 2) {
                        var check = window.confirm("タツノオトシゴに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC12.html";
                        }
                    } else if (myTeamNum == 3) {
                        var check = window.confirm("インコに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC17.html";
                        }
                    }
                }
            })
        }
    })
}

function select5() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;
            docRef.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    var myTeamNum = doc.data().teamNumber;
                    if (myTeamNum == 1) {
                        var check = window.confirm("ライオンに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC8.html";
                        }
                    } else if (myTeamNum == 2) {
                        var check = window.confirm("タコに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC13.html";
                        }
                    } else if (myTeamNum == 3) {
                        var check = window.confirm("トンビに転生しますか？");
                        if (check) {
                            location.href = "./avatorTransfer/trC18.html";
                        }
                    }
                }
            })
        }
    })
}