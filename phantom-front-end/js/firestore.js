var config = {
    apiKey: "AIzaSyAZVb3Vk7ugTqfjRBNwg1SzDa6jGXCySZg",
    authDomain: "silicon-alpha-220717.firebaseapp.com",
    databaseURL: "https://silicon-alpha-220717.firebaseio.com",
    projectId: "silicon-alpha-220717",
    storageBucket: "silicon-alpha-220717.appspot.com",
    messagingSenderId: "91241183953"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});