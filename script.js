

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB8jJWu1lmuBgToqmo_lFkiNSQgxfrplZk",
    authDomain: "easy-journey2024.firebaseapp.com",
    databaseURL: "https://easy-journey2024-default-rtdb.firebaseio.com",
    projectId: "easy-journey2024",
    storageBucket: "easy-journey2024.appspot.com",
    messagingSenderId: "411835766644",
    appId: "1:411835766644:web:69fb9e8e84f18307637e21"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);


// Register button event listener
let registerButton = document.getElementById('registerSubmitBtn');
registerButton.addEventListener('click', () => {
    let email = document.getElementById('Email').value;
    let password = document.getElementById('Password').value;
    let firstname = document.getElementById('Username').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(database, 'users/' + user.uid), {
                username: firstname,
                email: email,
                password: password
            })
                .then(() => {
                    alert('User created successfully!');
                    showlogin();
                })
                .catch((error) => {
                    alert('error');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            alert(`Error: ${errorMessage}`);
        });
});

// Login button event listener
let loginButton = document.getElementById('loginSubmitBtn');
loginButton.addEventListener('click', () => {
    let email = document.getElementById('Email').value;
    let password = document.getElementById('Password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
              // Optionally, handle success (e.g., redirect to dashboard)
              window.location.href = 'Ticket.html'; // Redirect to dashboard after login
          })
            // update(ref(database, 'users/' + user.uid), {
            //     last_login: Date.now()
            // })
                // .then(() => {
                //     alert('User Logged in successfully!');
                //     localStorage.setItem('isLoggedIn', 'true'); // Set login state
                //     window.location.href = 'Ticket.html'; // Redirect to ticket page
                // })
                // .catch((error) => {
                //     alert('error');
                // });
        
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            alert(`Error: ${errorMessage}`);
        });
});


let logout = document.getElementById('logoutBtn');
logout.addEventListener('click', ()=>{

  signOut(auth).then(() => {
    // Sign-out successful.
    alert('logout successfully!');
  }).catch((error) => {
    // An error happened.
  });
});


// Forgot password link event listener
let forgotpassword = document.getElementById('Forgotpassword');
forgotpassword.addEventListener('click', () => {
    let email = document.getElementById('Emaillogin').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});