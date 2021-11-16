//先に登録情報の変更の部分を着手して、このソースをもとにサインアップの際のユーザー情報登録の機構を作ろうと思ってる

//公式のユーザー情報(Authentication)の変更の機構
const auth = getAuth();
updateProfile(auth.currentUser, {
  displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(() => {
  // Profile updated!
  // ...
}).catch((error) => {
  // An error occurred
  // ...
});
//パスワードの新規設定をする際に使えるらしい(メモ)
//confirmPasswordReset(code, password)
//https://blog.ojisan.io/firebase-auth-ipass-login/

//ユーザー名を送信する機構
async function createUserdate(userName){
  try {
    await addDoc(collection(getFirestore(), 'users'), {
      name: userName,
      profilePicUrl: getProfilePicUrl(),//この辺どうやって書き換えるか悩み中
      timestamp: serverTimestamp()
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}
function onCreateUserdateFormSubmit(e) {//書き換え未着手、構造がまだ追えてない
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    createUserdate(userDateInputElement.value).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(userDateInputElement);
      toggleButton();
    });
  }
}

//プロフィール画像を送信する機構　多分これを使うっていうのは分かったんだけど、とりあえずユーザー名やパスワードの部分を優先する
async function saveImageMessage(file) {
  // TODO 9: Posts a new image as a message.
  try {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    const messageRef = await db.addDoc(collection(getFirestore(), 'messages'), {
      name: getUserName(),
      imageUrl: LOADING_IMAGE_URL,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp()
    });

    // 2 - Upload the image to Cloud Storage.
    const filePath = `${getAuth().currentUser.uid}/${messageRef.id}/${file.name}`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    
    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    // 4 - Update the chat message placeholder with the image's URL.
    await updateDoc(messageRef,{
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath
    });
  } catch (error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  }
}

function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000,
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}