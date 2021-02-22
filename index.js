const firebase = require('firebase');
const {spawn} = require('child_process');

var firebaseConfig = {
  apiKey: "AIzaSyA7N-GCI5LbiytnE7mS8kT3a1WUhOMl0GM",
  authDomain: "suazoapp.firebaseapp.com",
  projectId: "suazoapp",
  storageBucket: "suazoapp.appspot.com",
  messagingSenderId: "125392522892",
  appId: "1:125392522892:web:baebb7dd51a0394d5035a9",
  measurementId: "G-L0MJNSNVKP"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Document ID for testing: 3OLLxLj7dmLbRbb2MPFT
async function getUserData(){
    const data = db.collection('users').doc('3OLLxLj7dmLbRbb2MPFT');
    const doc = await data.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
    }
    console.log(doc.get('Adress'));
    const python = spawn('python', ['script1.py',doc.get('name'),doc.get('Adress'),doc.get('city'),doc.get('State'),doc.get('Zip')]);
}
getUserData();