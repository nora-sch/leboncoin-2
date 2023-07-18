const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require("nodemailer");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendMail = async (emailTo, emailHtml) => {
  console.log(emailTo);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "nora.sumane@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: "Nora <nora.sumane@gmail.com>",
    to: emailTo,
    subject: "test nodmailer",
    html: emailHtml,
  });
  console.log("message sent: " + info.messageId);
};

const sendSms = (msg, phoneTo = "+37126339023") => {
  client.messages
    .create({
      body: msg,
      from: "+16203203081",
      to: phoneTo,
    })
    .then((message) => console.log(`${message.sid} - sent to ${message.to}`));

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
};
// sendSms("This is the message from Twilio to Nora");
// sendMail(
//   `<h1>Hello world!</h><p>Click below!</p> <p>This is the email verification link : </p>`
// );
module.exports = {
  sendMail,
  sendSms,
};
