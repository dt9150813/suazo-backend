const firebase = require('firebase');
const {
  spawn
} = require('child_process');
const express = require('express');
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

async function downloadFile(res, filePath) {
  await res.download(filePath);
}

async function coo(uid, mailing, res) {
  var userData = await getUserData(uid);
  // console.log("userData from getUserData: ", userData);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['coo.py', JSON.stringify(userData), mailing]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.stderr.on('data', function (data) {
      console.error(data.toString());
    });
    python.on('close', () => {
      if (fs.existsSync(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`)) {
        resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
      } else {
        console.log("sending error code")
        res.status(500).send("The script did not generate pdf correctly!")
      }
    });
  });
}

async function ss4(uid, mailing, res) {
  var userData = await getUserData(uid);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['ss4.py', JSON.stringify(userData), mailing]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.stderr.on('data', function (data) {
      console.error(data.toString());
    });
    python.on('close', () => {
      if (fs.existsSync(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_ss4.pdf`)) {
        resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_ss4.pdf`);
      } else {
        console.log("sending error code")
        res.status(500).send("The script did not generate pdf correctly!")
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

async function mail(uid, filePath, res) {
  var userData = await getUserData(uid);
  var result;
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['stannp.py', JSON.stringify(userData), filePath]);
    python.stdout.on('data', (data) => {
      result = String(data).trim();
      console.log(result);
    });
    python.stderr.on('data', function (data) {
      console.error(data.toString());
    });
    python.on('close', () => {
      if (result == "True") {
        resolve(console.log("Mail sent"));
      }
      else if (result == "False") {
        resolve(console.log("Mail didn't send"));
      }
      else {
        reject(console.log("Something went wrong in the mailing script"));
      }
    });
  });
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/file', express.static('../tmp/'));

app.get('/:file/:method/:uid', async function (req, res) {
  var file = req.params.file;
  var method = req.params.method;
  var uid = req.params.uid;
  var filePath;
  var mailing = (method == "mail" ? true : false);
  console.log(`Got mailing from URL: ${mailing}`);
  if (file == "coo") {
    try {
      filePath = await coo(uid, mailing, res);
      console.log("coo function done");
      // console.log(filePath);
    } catch (error) {
      res.status(404).send("Failed to generate COO file")
    }
  } else if (file == "ss4") {
    try {
      filePath = await ss4(uid, mailing, res);
      console.log("ss4 function done");
    } catch (error) {
      res.status(404).send("Failed to generate SS4 file")
    }
  } else {
    console.log("File type doesn't exist!");
    res.sendStatus(404).send("File type doesn't exist!");
    return;
  }
  if (method == "download") {
    try {
      await downloadFile(res, filePath);
      console.log("File downloaded");
      return;
    } catch (error) {
      res.sendStatus(404).send("Download function failed");
    }
  } else if (method == "email") {
    try {
      await email(uid, file, filePath);
      console.log("Email sent");
    } catch (error) {
      res.sendStatus(404).send("Email function failed");
    }
  } else if (method == "mail") {
    try {
      await mail(uid, filePath, res)
    } catch (error) {
      res.sendStatus(404).send("Mail function failed");
    }
  } else if (method == "view") {
    try {
      var data = fs.readFileSync(filePath);
      res.contentType("application/pdf");
      res.send(data);
      return;
    } catch (error) {
      res.sendStatus(404).send("View function failed");
    }
  } else {
    res.sendStatus(404).send("This method doesn't exist!");
  }
  // fs.unlink(filePath, (err) => {
  //   if (err) console.log(err);
  //   else console.log("Removed ", filePath);
  // });
  // res.sendStatus(200).send("Success");
  return;
});