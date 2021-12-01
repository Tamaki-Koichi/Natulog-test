// サインアップボタンが押されたら
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            location.href = './transfer.html';
            // ...
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
}

// サインイン処理
function toggleSignIn() {
    console.log(firebase.auth());
    console.log(firebase.auth().currentUser);
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // ログイン.
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
        });
    }
    document.getElementById('quickstart-sign-in').disabled = true;

}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */

function initApp() {
    //このコンソールは initAppを呼び出すために必須なので削除厳禁
    console.log('initApp');
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        // document.getElementById('quickstart-verify-email').disabled = true;
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            document.getElementById('quickstart-sign-in').textContent = 'サインアウト';
            location.href = './myroom.html';
            stringify(user, null, '  ');
            if (!emailVerified) {
                document.getElementById('quickstart-verify-email').disabled = false;
            }
        } else {
            // User is signed out.
            document.getElementById('quickstart-sign-in').textContent = 'サインイン';
        }
        document.getElementById('quickstart-sign-in').disabled = false;
    });
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}
// window.addEventListener = function() {
window.onload = function() {
    initApp();

};


// ページ移動するためのタイマーをセット
function tm() {
    tm = setTimeout("loc()", 10 * 1000);
}

function loc() {
    window.location = "../transferred.html";
}

//ログアウト時のエラーについて
// Firefox・Chromeゲストアカウントでサインイン可能。
// ただし、Firefoxでログイン＞ログアウトすると、”ログアウト時にエラーが発生しました (ReferenceError: toggleSignIn is not defined)”のエラー表示あり。再度メアド・パスワード入力すると、入力した値が上手く送信されず、nullになってconsole log表示される。その後、もう一度入力して送信ボタン押すと画面がMyroomに切り替わる。