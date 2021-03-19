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
// Document ID for testing: 3OLLxLj7dmLbRbb2MPFT
async function getUserData(id, res) {
    // var promise = new Promise(function (resolve, reject) {
    //     // do a thing, possibly async, then…

    //     if (/* everything turned out fine */) {
    //         resolve("Stuff worked!");
    //     }
    //     else {
    //         reject(Error("It broke"));
    //     }
    // });
    console.log(`ID passed to the async function: ${id}`)
    const data = db.collection('users').doc(id);
    const doc = await data.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
    }
    const python = spawn('python', ['script1.py', id]);
    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    python.stdin.write(JSON.stringify(doc.data()))
    python.stdin.end()
    // python.stdin.write(JSON.stringify(doc.data()))
    // python.stdin.end()
    // console.log('start waiting')
    // await delay(5000);
    // console.log('waited 5s')
    // res.download(`../tmp/${id}.pdf`);
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                console.log("Inside the promise");
                if (resolvedFlag == true) {
                    resolve(res);
                } else {
                    reject("Rejected")
                }
            }, 2000
        );
    });
}
var resolvedFlag = true;
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
app.get('/:uid', function (req, res) {
    var id = req.params.uid;
    console.log(`ID found from URL: ${id}. Start getUserData func`);
    // getUserData(id, res);
    console.log(res)
    let myPromise = getUserData(id, res);
    myPromise.then((res) => {
        res.download(`../tmp/${id}_Certificate_of_Organization.pdf`);
    }).catch((error) => {
        console.log(`Handling error as we received ${error}`);
    });

    // fs.unlink('96GVO2bM0sj7GzYonzuk.pdf', (err)=>{if (err){throw err;} console.log("file deleted"); });
    // var filePath = `../tmp/${id}.pdf`;
    // fs.readFile(__dirname + filePath, function (err, data) {
    //   res.contentType("application/pdf");
    //   res.send(data);
    // });
});
//opens the url in the default browser