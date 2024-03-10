// Import the Firebase SDK
import firebase from 'firebase/app';
import 'firebase/database';

import New from './assets/new.png'

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCEDEwlNE6-CXsdhME6FRhdxke3HF5gU7A",
    authDomain: "gekonge-project.firebaseapp.com",
    projectId: "gekonge-project",
    storageBucket: "gekonge-project.appspot.com",
    messagingSenderId: "853191641615",
    appId: "1:853191641615:web:49a91ec8568fd6be53f17a",
    // databaseURL: "YOUR_DATABASE_URL",
  
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();



const newData = {
    key: '1',
    image: New, 
    title:"Sample Item",
    content:'New and ready'
    // other fields
  };
  
  // Push new data to a specific node
  const newRef = database.ref('blog/blogs').push();
  newRef.set(newData);
  