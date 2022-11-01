const https = require("http");
const server = https.createServer((req, res) => {
  console.log("request made");
});

server.listen(3000, "127.0.0.1", (err) => {
  console.log("connected");
});
