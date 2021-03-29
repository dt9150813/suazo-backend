const firebase = require('firebase');
const { spawn } = require('child_process');
const util = require('util');
const app = require('express')();
const fs = require('fs');
const nodemailer = require("nodemailer");
const port = process.env.PORT || 3000;

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
// Document ID for testing: n13JX6KUJVWTrb78OkCvIIXp71G2

async function getUserData(uid) {
  var data = db.collection('users').doc(uid);
  var doc = await data.get();
  return doc.data();
}

function downloadFile(res, filePath) {
  res.download(filePath);
}

async function coo(uid) {
  userData = await getUserData(uid);
  console.log("userData from getUserData: ", userData);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['coo.py', JSON.stringify(userData)]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.on('close', () => {
      resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
    });
  });
}

async function ss4(uid) {
  var userData = await getUserData(uid);
  console.log("userData from getUserData: ", userData);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['ss4.py', JSON.stringify(userData)]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.on('close', () => {
      resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_ss4.pdf`);
    });
  });
}

async function email(uid, file, filePath) {
  var emailSubject;
  var emailText;
  var userData = await getUserData(uid);
  var emailRecipient = userData['email'];
  if (file == "coo") {
    emailSubject = "Utah LLC Document"
    emailText = "Hello,\n\nHere is your Utah LLC PDF file.\n\nSincerely,\n\nSuazo Business Center"
  } else if (file == "ss4") {
    emailSubject = "Federal EIN Document"
    emailText = "Hello,\n\nHere is your Federal EIN PDF file.\n\nSincerely,\n\nSuazo Business Center"
  }
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "sauzoautogenerator@gmail.com", // generated ethereal user
      pass: "Strongpassword", // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Suazo Business Center" <sauzoautogenerator@gmail.com>', // sender address
    to: emailRecipient, // list of receivers
    subject: emailSubject, // Subject line
    text: emailText, // plain text body
    // html: "<b>Hello world?</b>", // html body
    attachments: [{
      filename: filePath.replace("../tmp/", ""),
      path: filePath,
      contentType: 'application/pdf'
    }],
  });
  console.log("Message sent: %s", info.messageId);
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/ss4/:uid', function (req, res) {
  var uid = req.params.uid;
  ss4(uid).then((value) => {
    console.log("File path: ", value);
  });
  res.send();
});

app.get('/:file/:method/:uid', async function (req, res) {
  var file = req.params.file;
  var method = req.params.method;
  var uid = req.params.uid;
  var filePath;
  if (file == "coo") {
    filePath = await coo(uid);
    console.log("coo function done");
  } else if (file == "ss4") {
    filePath = await ss4(uid);
    console.log("ss4 function done");
  } else {
    console.log("File type doesn't exist!");
    res.send();
  }

  if (method == "download") {
    downloadFile(res, filePath);
    console.log("File downloaded");
  } else if (method == "email") {
    await email(uid, file, filePath);
    console.log("Email sent");
  } else if (method == "mail") {
    console.log("Mail method is coming soon!")
  } else {
    console.log("This method doesn't exist!");
  }
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    else console.log("Removed ", filePath);
  });
  return;
});
