import * as firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDws-LHxZB-i_mGwcvXiJ71eQQriAmywLE",
  authDomain: "foodstash-7e598.firebaseapp.com",
  databaseURL: "https://foodstash-7e598-default-rtdb.firebaseio.com",
  projectId: "foodstash-7e598",
  storageBucket: "foodstash-7e598.appspot.com",
  messagingSenderId: "49630233409",
  appId: "1:49630233409:web:431719a80bb1faaa10d7c0",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default firebase;
