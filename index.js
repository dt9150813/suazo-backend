const firebase = require('firebase');
const { spawn } = require('child_process');
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

function downloadFile(res, filePath) {
  res.download(filePath);
}

async function coo(uid, mailing) {
  userData = await getUserData(uid);
  // console.log("userData from getUserData: ", userData);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['coo.py', JSON.stringify(userData), mailing]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.on('close', () => {
      resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
    });
  });
}

async function ss4(uid, mailing) {
  var userData = await getUserData(uid);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['ss4.py', JSON.stringify(userData), mailing]);
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

async function mail(uid, filePath) {
  userData = await getUserData(uid);
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['stannp.py', JSON.stringify(userData), filePath]);
    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    python.on('close', () => {
      resolve(console.log("mail function done"));
    });
  });
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

app.use('/file', express.static('../tmp/'));

app.get('/:file/:method/:uid', async function (req, res) {
  var file = req.params.file;
  var method = req.params.method;
  var uid = req.params.uid;
  var filePath;
  var mailing = (method == "mail" ? true : false);
  console.log(`Got mailing from URL: ${mailing}`);
  if (file == "coo") {
    filePath = await coo(uid, mailing);
    console.log("coo function done");
    console.log(filePath);
  } else if (file == "ss4") {
    filePath = await ss4(uid, mailing);
    console.log("ss4 function done");
  } else {
    console.log("File type doesn't exist!");
    res.sendStatus(404);
    return;
  }

  if (method == "download") {
    downloadFile(res, filePath);
    console.log("File downloaded");
  } else if (method == "email") {
    await email(uid, file, filePath);
    console.log("Email sent");
  } else if (method == "mail") {
    await mail(uid, filePath)
    console.log("Mail sent")
  } else if (method == "view") {
    var data = fs.readFileSync(filePath);
    res.contentType("application/pdf");
    res.send(data);
    console.log("Pdf sent to browser")
  } else {
    console.log("This method doesn't exist!");
    res.sendStatus(404);
  }
  // fs.unlink(filePath, (err) => {
  //   if (err) console.log(err);
  //   else console.log("Removed ", filePath);
  // });
  return;
});

app.get('/businessNameCheck/:name', async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const puppeteer = require("puppeteer-extra");
  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  const randomUserAgent = require("random-useragent");

  puppeteer.use(StealthPlugin());

  let businessName = req.params.name;
  // we don't allow more than 10 attempts
  let attemptRemaining = 10;

  do {
    console.log('opening browser bot ...');
    let browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    let page = await browser.newPage();

    await page.goto("https://secure.utah.gov/bes");
    await page.evaluate(() => {
      document.querySelector("input[name=businessName]").value = "";
    });
    await page.type("input[name=businessName]", businessName, { delay: 30 });
    await page.setUserAgent(randomUserAgent.getRandom());
    await page.click("#searchByNameButton");
    await page.waitForNavigation();

    // let browserError = await page.$(".errors");
    // if (browserError === null) {
    let success = await page.$(".successMessage");
    let entities = await page.$(".entities");

    if (success !== null) {
      console.log("Available");
      attemptRemaining = 0;
      res.sendStatus(200);
      res.end();
    } else if (entities !== null) {
      console.log("Unavailable");
      attemptRemaining = 0;
      res.sendStatus(202);
      res.end();
    } else {
      // the requested name has no error, no sucess, no existing entities
      // which means something went wrong outside our control, so we try again
      attemptRemaining--;
      if (attemptRemaining === 0) {
        res.sendStatus(408);
        res.end();
      }
    }
    // } else {
    //   attemptRemaining = 1;
    // }
    await browser.close();
  } while (attemptRemaining > 0)

  return;
});
