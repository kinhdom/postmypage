const express = require('express');
const router = express.Router();
const firebase = require("firebase");
// import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA8Vw2Ll2PhUV1vUDqbCLLCiBCGr4InrJE",
    authDomain: "xuanhuy-db49a.firebaseapp.com",
    databaseURL: "https://xuanhuy-db49a.firebaseio.com",
    projectId: "xuanhuy-db49a",
    storageBucket: "xuanhuy-db49a.appspot.com",
    messagingSenderId: "490786365884"
};
const defaultApp = firebase.initializeApp(firebaseConfig);
// const defaultStorage = firebase.storage();
const database = firebase.database().ref('postmypage');
// Get all items
router.get('/pages/:user', function (req, res) {
    let user = req.params.user
    database.child('users').child(user).child('pages').on('value', (data) => {
        res.json(data.val())
    })
})
router.get('/infopage', function (req, res) {
    db.loca.find({}, (err, locas) => {
        if (err) throw err;
        console.log('Geted all items')
        res.json(locas)
    })
})

router.get('/test', function (req, res) {
    database.ref('huy').child('van').on('value', (data) => {
        res.json(data.val())
    })
    console.log('test...')
    // res.json({ a: 3 })
})

module.exports = router;