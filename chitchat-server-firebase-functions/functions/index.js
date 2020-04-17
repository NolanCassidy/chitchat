// // https://firebase.google.com/docs/functions/write-firebase-functions

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

//The Nexmo Api
const Nexmo = require('nexmo');
const from = '';
const sms = new Nexmo({
  apiKey: '',
  apiSecret: '',
});

//numbers is a set of the subscribers numbers constantly updated
var numbers = [];
const usersRef = admin.database().ref('subscribers');
usersRef.on('value', function(snapshot) {
numbers.push( snapshot.val() );
});

// Take the incomingData parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /chats
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the parameters.
  const params = req.body;
  let incomingData = {
    messageId: params.messageId,
    from: params.msisdn,
    text: params.text,
    type: params.type,
    content: params.text,
    uid: params.msisdn,
    timestamp: Date.now()
  };
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('chats/').push({
    messageId: params.messageId,
    from: params.msisdn,
    text: params.text,
    type: params.type,
    content: params.text,
    uid: params.msisdn,
    timestamp: Date.now()
  });

  res.redirect(200,snapshot.ref.toString());
});

//Takes incoming messages and checks them for action
exports.stopSubscribers = functions.database.ref('/chats/{pushId}')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();

      //stops subscription
      if(original.content.toUpperCase()==='STOP'){
        return admin.database().ref('/subscribers').child(original.uid).set({phone_number: original.uid, subscriber:false, timestamp:Date.now()});
      }
      //sends help sms back to user
      if(original.content.toUpperCase()==='HELP'){
        return sms.message.sendSms(from, original.uid, 'I do not have much help at the moment');
      }

      const sub = admin.database().ref('/subscribers');
      // New subscribers recieve welcom message and get added to subscribers database
      if(original.content.toUpperCase()==='JOIN'){
        sms.message.sendSms(from, original.uid, 'I legally have to say this I am sorry: Msg&Data rates may apply. 2msg/wk. Reply HELP for help, STOP to cancel.');
        return admin.database().ref('/subscribers').child(original.uid).set({phone_number:original.uid, subscriber:true, timestamp:Date.now()});
      }

      return null;
    });
