const firebase = require('firebase');
const { spawn } = require('child_process');
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
async function getUserData(id) {
  console.log(`ID passed to the async function: ${id}`)
  const data = db.collection('users').doc(id);
  const doc = await data.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
  // console.log("Python start")
  const python = spawn('python', ['script1.py', id, doc.get('name'), doc.get('Adress'), doc.get('city'), doc.get('State'), doc.get('Zip')]);
  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  // console.log("Python end")
}
const app = require('express')(),
  fs = require('fs'),
  port = process.env.PORT || 3000
app.get('/:uid', function (req, res) {
  var id = req.params.uid;
  console.log(`ID found from URL: ${id}`);
  getUserData(id);
  // var filePath = `/${id}.pdf`;
  // fs.readFile(__dirname + filePath, function (err, data) {
  //   res.contentType("application/pdf");
  //   res.send(data);
  // });
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
const open = require('open');
//opens the url in the default browser
// open('http://localhost:3000/96GVO2bM0sj7GzYonzuk');