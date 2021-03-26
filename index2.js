const firebase = require('firebase');
const { spawn } = require('child_process');
const open = require('open');
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
const nodemailer = require("nodemailer");


// Document ID for testing: n13JX6KUJVWTrb78OkCvIIXp71G2

async function getUserData(uid) {
    var data = db.collection('users').doc(uid);
    var doc = await data.get();
    return doc.data();
}

async function coo(uid) {
    var userData = await getUserData(uid);
    // console.log("Data got from getUserData: ", userData);
    const python = spawn('python', ['coo.py']);
    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    python.stdin.write(JSON.stringify(userData));
    python.stdin.end()
    filePath = `../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`;
    console.log("FilePath found in coo function: ", filePath);
    // return `../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`;
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                console.log("Inside the promise");
                if (fs.existsSync(filePath)) {
                    resolve(filePath);
                } else {
                    reject("Rejected")
                }
            }, 0
        );
    });
    // getUserData(uid).then((userData) => {
    //     const python = spawn('python', ['coo.py']);
    //     python.stdout.on('data', (data) => {
    //         console.log(`stdout: ${data}`);
    //     });
    //     python.stdin.write(JSON.stringify(userData));
    //     python.stdin.end()
    //     return new Promise((resolve, reject) => {
    //         setTimeout(
    //             () => {
    //                 console.log("Inside the promise");
    //                 if (resolvedFlag == true) {
    //                     resolve(`../tmp/${String(userData['businessName']).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
    //                 } else {
    //                     reject("Rejected")
    //                 }
    //             }, 5000
    //         );
    //     });
    // });
}

async function download(res, uid) {
    var cooResult = await coo(uid);
    console.log(cooResult);
    // res.download(`../tmp/${businessName}_Certificate_of_Organization.pdf`);
}

// var resolvedFlag = true;

async function email() {
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
        to: "eddy0712@gmail.com, zhujl97@gmail.com", // list of receivers
        subject: "Utah LLC document", // Subject line
        text: "Hello,\n\nHere is your Utah LLC PDF file.\n\nSincerely,\n\nSuazo Business Center", // plain text body
        // html: "<b>Hello world?</b>", // html body
        attachments: [{
            filename: 'ASD_FG_Inc_Certificate_of_Organization.pdf',
            path: '../tmp/ASD_FG_Inc_Certificate_of_Organization.pdf',
            contentType: 'application/pdf'
        }],
    });

    console.log("Message sent: %s", info.messageId);
}


app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
app.get('/coo/:uid', function (req, res) {
    var uid = req.params.uid;
    coo(uid);
    // .then((filePath) => {
    //     console.log("file path after coo function: ", filePath);
    //     res.download(filePath);
    // }).catch((error) => {
    //     console.log(`Handling error as we received ${error}`);
    // });
});
app.get('/:method/:file/:uid', function (req, res) {
    // var method = req.params.method;
    // var file = req.params.file;
    // var uid = req.params.uid;
    // console.log(method);
    // console.log(file);
    // console.log(uid);
    // coo(id, res).then((businessName) => {
    //     // console.log("businessName after coo function: ", businessName);
    //     // res.download(`../tmp/${businessName}_Certificate_of_Organization.pdf`);
    // }).catch((error) => {
    //     console.log(`Handling error as we received ${error}`);
    // });
});
app.get('/emailtest', function (req, res) {
    email();
});
app.get('/file/:fileName', function(req, res) {
    var fileName = req.params.fileName;
    var data = fs.readFileSync(`../tmp/${fileName}`);
    res.contentType("application/pdf");
    res.send(data);
})