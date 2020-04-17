//The firebase api credentials
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
