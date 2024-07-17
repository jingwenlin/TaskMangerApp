import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AlzaSyAZ9yPYsw57_9LfZQCROPKoXMkmbEhMR1Y',
    authDomain: 'taskmanager-69578.firebaseapp.com',
    databaseURL: 'https://taskmanager-69578.firebaseio.com',
    projectId: 'taskmanager-69578',
    storageBucket: 'taskmanager-69578.appspot.com',
    messagingSenderId: '375210925221',
    appId: '1:375210925221:ios:4948a4bceb95bff3d8c14c',
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);