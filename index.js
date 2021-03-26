const firebase = require('firebase');
const { spawn } = require('child_process');
const util = require('util');
const app = require('express')(),
  fs = require('fs'),
  port = process.env.PORT || 3000
const delay = ms => new Promise(res => setTimeout(res, ms));
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

async function coo(id, res) {
  console.log(`ID passed to the async function: ${id}`)
  const data = db.collection('users').doc(id);
  const doc = await data.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Data found');
  }
  const fileCreation = new Promise((resolve, reject) => {
    const python = spawn('python', ['coo.py', JSON.stringify(doc.data())]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.stdin.write(JSON.stringify(doc.data()))
    python.stdin.end()
    python.on('close', () => {
      resolve();
    });
  });
  fileCreation.then(() => {
    res.download(`../tmp/${String(doc.get('businessName')).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
  });
}

async function ss4(id, res) {
  console.log(`ID passed to the async function: ${id}`)
  const data = db.collection('users').doc(id);
  const doc = await data.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Data found');
  }
  const python = spawn('python', ['ss4.py', id]);
  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  python.stdin.write(JSON.stringify(doc.data())) // Passing firebase data into the python script
  python.stdin.end()
  console.log('start waiting')
  await delay(10000);
  console.log('waited 10s')
  res.download(`../tmp/${String(doc.get('businessName')).replace(/ /g, "_")}_ss4.pdf`);
}
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
app.get('/coo/:uid', function (req, res) {
  var id = req.params.uid;
  console.log(`ID found from URL: ${id}. Start getUserData func`);
  coo(id, res);
});
app.get('/ss4/:uid', function (req, res) {
  var id = req.params.uid;
  console.log(`ID found from URL: ${id}. Start getUserData func`);
  ss4(id, res);
});