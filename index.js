const firebase = require('firebase');
const {
  spawn
} = require('child_process');
const express = require('express');
const app = require('express')();
const fs = require('fs');
const nodemailer = require("nodemailer");
// const { Console } = require('node:console');
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
// Document ID for testing: TZVXX9485rQGFWm8Ge8RINrhOfX2

async function getUserData(uid) {
  var data = db.collection('users').doc(uid);
  var doc = await data.get();
  if (!doc.exists) {
    throw new Error("getUserData error: No such document!");
  }
  return doc.data();
}

async function downloadFile(res, filePath) {
  await res.download(filePath);
}

async function coo(uid, mailing) {
  var userData = await getUserData(uid);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['coo.py', JSON.stringify(userData), mailing]);
    python.stdout.on('data', (data) => {
      console.log("coo script message:");
      console.log(`${data}`);
    });
    python.stderr.on('data', (data) => {
      console.log("coo error message:");
      console.log(`${data}`);
    });
    python.on('close', () => {
      if (fs.existsSync(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`)) {
        resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
      } else {
        reject(new Error("The coo script did not generate pdf correctly!"));
      }
    });
  });
}

async function ss4(uid, mailing) {
  var userData = await getUserData(uid);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['ss4.py', JSON.stringify(userData), mailing]);
    python.stdout.on('data', (data) => {
      console.log("ss4 script message:");
      console.log(`${data}`);
    });
    python.stderr.on('data', (data) => {
      console.log("ss4 error message:");
      console.log(`${data}`);
    });
    python.on('close', () => {
      if (fs.existsSync(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_ss4.pdf`)) {
        resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_ss4.pdf`);
      } else {
        reject(new Error("The ss4 script did not generate pdf correctly!"));
      }
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

async function mail(uid, filePath) {
  var userData = await getUserData(uid);
  var result;
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['stannp.py', JSON.stringify(userData), filePath]);
    python.stdout.on('data', (data) => {
      result = String(data).trim();
      console.log(result);
    });
    python.stderr.on('data', (data) => {
      console.log("stannp error: ");
      console.log(`${data}`);
      result += `${data}`;
    });
    python.on('close', () => {
      console.log("result: ", result);
      if (result == "True") {
        resolve(console.log("Mail sent"));
      }
      else if (result == "False") {
        reject(new Error("Mail didn't send"));
      }
      else {
        reject(new Error("Something went wrong in the mailing script"));
      }
    });
  });
}

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/file', express.static('../tmp/'));

app.get('/:file/:method/:uid', async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var file = req.params.file;
  var method = req.params.method;
  var uid = req.params.uid;
  var filePath;
  var mailing = (method == "mail" ? true : false);
  try {
    if (file == "coo") {
      filePath = await coo(uid, mailing);
    } else if (file == "ss4") {
      filePath = await ss4(uid, mailing);
    } else {
      throw new Error("File type doesn't exist!");
    }
    if (method == "download") {
      await downloadFile(res, filePath);
      console.log("File downloaded");
      return;
    } else if (method == "email") {
      await email(uid, file, filePath);
      console.log("Email sent");
    } else if (method == "mail") {
      await mail(uid, filePath, res);
    } else if (method == "view") {
      var data = fs.readFileSync(filePath);
      res.contentType("application/pdf");
      res.send(data);
      return;
    } else {
      throw new Error("This method doesn't exist!");
    }
    fs.unlink(filePath, (err) => {
      if (err){
        throw new Error(err);
      }
      else console.log("Removed ", filePath);
    });
    console.log("Sending 200 response");
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    console.log("Sending 500 error response");
    res.sendStatus(500);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});