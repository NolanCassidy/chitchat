//if the uid is placed in this and a number is joined
//then that acounts chats will be sent to all that numbers subscribers
const adminlist = [''];
const adminnums = {'':''};

//The Nexmo api credentials
const Nexmo = require('nexmo');
const from = '14085974831';
const client = new Nexmo({
  apiKey: '',
  apiSecret: '',
});
const sms = client.message;

//setting up express app on port 5000
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//gets outgoing messages from chat page
app.post('/outgoing', (req, res) => {
  //parse request
  let outgoing = {
    text: req.body.content,
    numbers: req.body.subs,
    uid: req.body.uid
  };
  //if user is admin it sends to all users
  if(adminlist.includes(outgoing.uid)){
  outgoing.numbers.forEach(sub => {
    if(sub.subscriber === true){
      console.log("SENT SMS: "+sub.phone_number);
      client.message.sendSms(adminnums[outgoing.uid], sub.phone_number, outgoing.text);
    }
  });
}
});

//gets outgoing message to one user from send page and if user is admin it sends to all users
app.post('/outone', (req, res) => {
  //parse request
  let outgoing = {
    text: req.body.content,
    to: req.body.to
  };
  //sends message through nexmo api
  sms.sendSms(from, outgoing.to, outgoing.text);
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
