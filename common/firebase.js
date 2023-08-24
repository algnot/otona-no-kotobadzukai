const firebase = require('firebase/compat/app');
require('dotenv').config();
require ('firebase/compat/firestore');
require ('firebase/compat/storage');

const firebaseConfig = {
    apiKey: process.env.firebase_api_key,
    authDomain: process.env.firebase_auth_domain,
    projectId: process.env.firebase_project_id,
    storageBucket: process.env.firebase_storage_bucket,
    messagingSenderId: process.env.firebase_messaging_sender_id,
    appId: process.env.firebase_app_id,
    measurementId: process.env.measurementId,
}

const firebaseApp = firebase.initializeApp(firebaseConfig);
module.exports = {
    firestore: firebaseApp.firestore(),
    storage: firebaseApp.storage()
}