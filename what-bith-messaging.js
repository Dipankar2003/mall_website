const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");
//const customerData = require("./info.json");
const mongoose = require("mongoose");
const customerData = require("./model/messaging_number");
//const messageTemplate = require("./message.json");
const message_sending = async (msg, res) => {
  await customerData.find().then((customerData) => {
    const client = new Client();
    client.on("qr", (qr) => {
      //console.log('QR RECEIVED', qr);
      QRCode.toDataURL(qr, { small: true }, (err, qr) => {
        if (err) {
          console.log(err);
        } else {
          res.render("scan", { qr: qr });
        }
      });
      // qrcode.generate(qr, { small: true });
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
            "Hello " +
            customerData[i].First_name +
            ", Happy Birthday " +
            msg.message;
          client.sendMessage(chatId, text);
        } else if (month === cMonth && Day === cDay + 7) {
          let text =
            "Hello " +
            customerData[i].First_name +
            ", " +
            "Your Birthday is coming Next Week, " +
            msg.message;
          client.sendMessage(chatId, text);
        }
      }
    });

    client.initialize();
  });
};
module.exports = message_sending;
