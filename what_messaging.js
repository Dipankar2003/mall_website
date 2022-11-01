const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");
//const customerData = require("./info.json");
const mongoose = require("mongoose");
const customerData = require("./model/messaging_number");
//const messageTemplate = require("./message.json");
//const app = express.Router();
let qrCode = 0;
const message_sending = async (message, res) => {
  await customerData.find().then((customerData) => {
    client = new Client();
    client.on("qr", (qr) => {
      //console.log("QR RECEIVED", qr);
      QRCode.toDataURL(qr, { small: true }, (err, qr) => {
        if (err) {
          console.log(err);
        } else {
          // qr1.res=res;
          // qr1.qr=qr;
          res.render("scan", { qr });
        }
      });

      // qrcode.generate(qr, { small: true }).then((qr) => {});
    });

    //console.log(customerData);
    client.on("ready", async() => {
      //  res.redirect("/Message-sending");
      console.log("Client is ready!");

      for (let i in customerData) {
        //should be done once a day
        console.log(i);
        const number = customerData[i].Phone_number;
        const chatId = "91" + number + "@c.us";

        let text =
          "Hello " + customerData[i].First_name + ", " + message.message;
        console.log(text);
        await client.sendMessage(chatId, text);
        console.log("send");
      }
      console.log("out");
    });
    //return qrCode;
    // res.writeContinue();
    //console.log("init");
    client.initialize();
    // console.log("end");
  });
};
module.exports = message_sending;
//module.exports.qrCode = qrCode;
// const qr_code = () => {
//   return qrCode;
// };
