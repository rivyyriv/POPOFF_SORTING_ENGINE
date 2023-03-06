// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaXtQhApnquPm1oOEiI3ayOM-aa2mg37c",
  authDomain: "popofftesting.firebaseapp.com",
  projectId: "popofftesting",
  storageBucket: "popofftesting.appspot.com",
  messagingSenderId: "136016050023",
  appId: "1:136016050023:web:197b78ddf44213b8e161c2",
  measurementId: "G-PN4NK7F4GE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);