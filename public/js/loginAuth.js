// Initialize Firebase
import firebase from "firebase/compat";

const config = {
    apiKey: "AIzaSyDwyjIWGGJbJC95bowUumRbS_g_KImWfxM",
    authDomain: "football-webapp-cs353.firebaseapp.com",
    projectId: "football-webapp-cs353",
    storageBucket: "football-webapp-cs353.appspot.com",
    messagingSenderId: "263782230",
    appId: "1:263782230:web:a76fec49a0c32eb21f60f7",
    measurementId: "G-VWV9455Z9B"
};

firebase.initializeApp(config);

// Log user in with Firebase
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user){
            console.log('User logged in successfully');
        })
        .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

//Register user with Firebase
function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user){
            console.log('User registered successfully');
        })
        .catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ...
        });
}