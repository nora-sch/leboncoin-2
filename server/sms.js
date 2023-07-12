require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the message from Twilio to Nora',
     from: '+16203203081',
     to: '+37126339023'
   })
  .then(message => console.log(`${message.sid} - sent :${message.date_created}`));

  
//   {
//     "account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//     "api_version": "2010-04-01",
//     "body": "This is the message from Twilio to Nora",
//     "date_created": "Thu, 30 Jul 2015 20:12:31 +0000",
//     "date_sent": "Thu, 30 Jul 2015 20:12:33 +0000",
//     "date_updated": "Thu, 30 Jul 2015 20:12:33 +0000",
//     "direction": "outbound-api",
//     "error_code": null,
//     "error_message": null,
//     "from": "+15017122661",
//     "messaging_service_sid": null,
//     "num_media": "0",
//     "num_segments": "1",
//     "price": null,
//     "price_unit": null,
//     "sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//     "status": "sent",
//     "subresource_uris": {
//       "media": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json"
//     },
//     "to": "+15558675310",
//     "uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json"
//   }
