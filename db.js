const firebase = require('firebase');
// import "firebase/analytics";
// import "firebase/auth";
// import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyA7N-GCI5LbiytnE7mS8kT3a1WUhOMl0GM",
  authDomain: "suazoapp.firebaseapp.com",
  projectId: "suazoapp",
  storageBucket: "suazoapp.appspot.com",
  messagingSenderId: "125392522892",
  appId: "1:125392522892:web:baebb7dd51a0394d5035a9",
  measurementId: "G-L0MJNSNVKP"
};
// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const db = firebase.firestore();
// export const auth = firebase.auth();