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
// Document ID for testing: n13JX6KUJVWTrb78OkCvIIXp71G2

async function getUserData(id) {
    var data = db.collection('users').doc(id);
    var doc = await data.get();
    if (!doc.exists) {
        console.log('No such document!')
    } else {
        console.log('Data found');
        console.log(doc.data());
    }
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                if (true) {
                    resolve(doc.data());
                } else {
                    reject("Something went wrong in getUserData")
                }
            }, 2000
        );
    });
}

async function coo(id, res) {
    getUserData(id).then((value)=>{
        
    });
    // const python = spawn('python', ['coo.py']);
    // python.stdout.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    // });
    // python.stdin.write(JSON.stringify(userData));
    // python.stdin.end()
    // return new Promise((resolve, reject) => {
    //     setTimeout(
    //         () => {
    //             console.log("Inside the promise");
    //             if (resolvedFlag == true) {
    //                 resolve(res);
    //             } else {
    //                 reject("Rejected")
    //             }
    //         }, 2000
    //     );
    // });
}
var resolvedFlag = true;
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
app.get('/coo/:uid', function (req, res) {
    var id = req.params.uid;
    let myPromise = coo(id, res);
    myPromise.then((value) => {
        console.log(value);
        // res.download(`../tmp/${String(doc.get('businessName')).replace(/ /g, "_")}_Certificate_of_Organization.pdf`);
    }).catch((error) => {
        console.log(`Handling error as we received ${error}`);
    });
});