const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
//const customerData = require("./info.json");
const mongoose = require("mongoose");
const customerData = require("./model/messaging_number");
//const messageTemplate = require("./message.json");

const message_sending = async (message, res, link) => {
  await customerData.find().then((customerData) => {
    const client = new Client();
    client.on("qr", (qr) => {
      //console.log('QR RECEIVED', qr);
      if (link == 0) {
        QRCode.toDataURL(qr, { errorCorrectionLevel: "H" }, (err, qr) => {
          if (err) {
            console.log(err);
          } else {
            res.render("scan", { qr });
          }
        });
      }
      //  qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("Client is ready!");

      let currentDate = new Date();
      let cDay = currentDate.getDate();
      let cMonth = currentDate.getMonth() + 1;

      for (let i in customerData) {
        //should be done once a day

        let date = new Date(customerData[i].DOB);
        let Day = date.getDate();
        let month = date.getMonth() + 1;
        const number = customerData[i].Phone_number;
        const chatId = "91" + number + "@c.us";

        if (month === cMonth && Day === cDay) {
          let text =
            "Hello " + customerData[i].First_name + ", " + message.message;
          client.sendMessage(chatId, text);
        } else if (
          customerData[i]["Birth Month"] === cMonth &&
          customerData[i]["Birth Date"] === cDay + 7
        ) {
          let text =
            "Hello " +
            customerData[i].First_name +
            ", " +
            "Your Birthday is coming";
          client.sendMessage(chatId, text);
        }
      }
    });

    client.initialize();
  });
};
module.exports = message_sending;
