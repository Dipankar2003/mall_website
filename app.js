const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const nodemailer = require("nodemailer");
const Customer = require("./model/customer");
const Gallery = require("./model/gallery_model");
const Message = require("./model/message_model");
const Login = require("./model/login_model");
const Banner = require("./model/banner_model");
const Slider = require("./model/slider_model");
const DOB_number = require("./model/messaging_number");
const Email = require("nodemailer");

const birth_msg = require("./what-bith-messaging");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const what_message = require("./what_messaging");
const { reset } = require("nodemon");
// const gallery_template = fs.readFileSync("./views/gallery.ejs", "utf-8");
// const replaceTemplate = require("./model/replaceTemplate");
const username = "Customer_detail";
const password = "Customer_detail_123";
const database_name = "Customer";
let userData = new Object();

const app = express();
app.use(bodyParser.json());

//connect database
//const DBuri = `mongodb+srv://${username}:${password}@nodepractice.bpsc6bg.mongodb.net/${database_name}?retryWrites=true&w=majority`;
const DBuri = `mongodb://${username}:${password}@ac-j3im6lj-shard-00-00.bpsc6bg.mongodb.net:27017,ac-j3im6lj-shard-00-01.bpsc6bg.mongodb.net:27017,ac-j3im6lj-shard-00-02.bpsc6bg.mongodb.net:27017/${database_name}?ssl=true&replicaSet=atlas-ymw7xh-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(DBuri)
  .then((result) => {
    app.listen(3000);
    console.log("connected...");
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
//middleware to accept data from form
app.use(express.urlencoded({ extended: true }));

//Uploading customer-data of registration page to database Start
app.post("/upload", (req, res) => {
  const customer_data = new Customer(req.body);

  userData.First_name = customer_data.First_name;
  userData.Phone_number = customer_data.Phone_number;
  userData.DOB = customer_data.DOB;
  const user_number = new DOB_number(userData);
  user_number
    .save()
    .then((result) => {
      console.log("saved");
    })
    .catch((err) => console.log(err));

  customer_data
    .save()
    .then((result) => {
      //REDIRECTING TO REGISTRATION PAGE
      res.redirect("/Register");
    })
    .catch((err) => console.log(err));
});
//Uploading customer-data of registration page to database End

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: async (req, file, cb) => {
    let newImagePath;
    newImagePath = Date.now() + path.extname(file.originalname);
    cb(null, newImagePath);
  },
});

const upload = multer({ storage: storage }).single("upload");

//Saving gallery images to database Start
app.post("/save", (req, res) => {
  upload(req, res, async (err) => {
    const gallery_data = await new Gallery({
      Product_name: req.body.Product_name,
      Product_price: req.body.Product_price,
      Category: req.body.Category,
      Product_Desc: req.body.Product_Desc,
      Product_img: req.file.filename,
    });
    gallery_data
      .save()
      .then((result) => {
        //REDIRECTING TO PRODUCT FORM PAGE
        product();
        res.redirect("/productform");
      })
      .catch((err) => console.log(err));
  });
});
//Saving gallery images to database End

let data;
//Displaying gallery Start
const product = async () => {
  data = await Gallery.find();
  data = JSON.stringify(data);
  data = JSON.parse(data);
};
//Displaying gallery End

//Deleting product from gallery Start
app.post("/deleteGallery", (req, res) => {
  console.log(req.body.id);
  Gallery.findOneAndDelete({ _id: req.body.id }).then(() => {
    console.log("deleted gallery");
    res.redirect("/gallery");
  });
});
//Deleting product from gallery End

const birth = async (res) => {
  await Message.findById({ _id: "63577333eef14190b39aa210" }).then(
    async (msg1) => {
      birth_msg(msg1, res);
    }
  );
};

//Birthday Message sending Start
app.post("/Birth-message", async (req, res) => {
  if (req.body.message) {
    await Message.findByIdAndUpdate(
      { _id: "63577333eef14190b39aa210" },
      { $set: { message: req.body.message } }
    ).then(() => {
      birth_msg(req.body, res);
    });
  } else {
    await Message.find().then((msg) => {
      if (msg) {
        birth(res);
        // res.redirect("/Message-sending");
      } else {
        const msg = new Message({
          type: "Birthday_msg",
          message: req.body.message,
        });
        birth(res);
        msg
          .save()
          .then((result) => {
            //REDIRECTING TO MESSAGE SENDING FORM PAGE
            //  res.redirect("/Message-sending");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});
//Birthday Message sending Start

//Discount Message sending Start
app.post("/message", async (req, res) => {
  // await Message.find({ type: "Message" }).then(async (msg) => {

  if (req.body.message) {
    await Message.findByIdAndUpdate(
      { _id: "6356aa6d5650dc11e99305c6" },
      { $set: { message: req.body.message } }
    ).then(() => {
      what_message(req.body, res);
    });
  } else {
    await Message.find().then((msg) => {
      if (msg[0]) {
        what_message(msg[0], res);
        // birth(res);
      } else {
        const msg = new Message({
          type: "Message",
          message: req.body.message,
        });
        what_message(msg, res);
        //birth(res);
        msg
          .save()
          .then((result) => {
            //REDIRECTING TO MESSAGE SENDING FORM PAGE
            //res.redirect("/Message-sending");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});
//Discount Message sending End

//Login page start
let flag = 0;
let OTP;
app.post("/Login", async (req, res) => {
  const enterEmail = req.body.Email;
  const enterOtp = req.body.passward;
  await Login.find({ Email: enterEmail }).then(async (re) => {
    if (re) {
      OTP = Math.floor(Math.random() * 9000) + 1000;
      //OTP = 1111;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ddubey10032003@gmail.com",
          pass: "qcifrzphugnukief",
        },
      });
      if (enterEmail == "ddubey10032002@gmail.com") {
        transporter.sendMail(
          {
            from: "ddubey10032003@gmail.com",
            to: "ddubey10032002@gmail.com",
            subject: "testing",
            text: `${OTP}`,
          },
          (err, info) => {
            if (err) {
              console.log(err);
              res.redirect("/admin");
            } else {
              console.log(OTP);
              res.render("otp");
            }
          }
        );
      } else {
        res.redirect("/admin");
        console.log("enter correct email");
      }

      // });
    } else {
      console.log("Wrong Email");
    }
  });
});

app.post("/loginOtp", (req, res) => {
  let enterOTP = Number(req.body.Email);
  if (enterOTP === OTP) {
    res.redirect("/home");
    // await product().then(async () => {
    //   await poster().then(async () => {
    //     await banner().then(() => {
    //       (allData.data = data), (allData.post = post), (allData.ban = ban);
    //       res.render("index", { allData: allData });
    //     });
    //   });
    // });
  } else {
    console.log(enterOTP);
  }
});
//Login page end

//Adding Slider to database end
app.post("/slider", (req, res) => {
  upload(req, res, async (err) => {
    const slider_img = await new Slider({
      Slider_img: req.file.filename,
    });
    // data.Slider_img = req.file.filename;
    slider_img
      .save()
      .then((result) => {
        //REDIRECTING TO PRODUCT FORM PAGE
        //product();
        res.redirect("/addslider");
      })
      .catch((err) => console.log(err));
  });
});
//Adding slider to database end

//Deleting Slider start
app.post("/deleteSlider", (req, res) => {
  // console.log(req.body.id);
  Slider.findOneAndDelete({ _id: req.body.id }).then(() => {
    console.log("deleted slider");
    res.redirect("/");
  });
});
// Deleting Slider end

//Adding banner start
app.post("/banner", (req, res) => {
  upload(req, res, async (err) => {
    const Banner_img = await new Banner({
      Banner_img: req.file.filename,
    });
    data.Banner_img = req.file.filename;
    Banner_img.save()
      .then((result) => {
        //REDIRECTING TO PRODUCT FORM PAGE
        //product();
        res.redirect("/addbanner");
      })
      .catch((err) => console.log(err));
  });
});
//Adding Banner end
//Deleting Banner start
app.post("/deleteBanner", (req, res) => {
  //console.log(req.body.id);
  Banner.findOneAndDelete({ _id: req.body.id }).then(() => {
    console.log("deleted banner");
    res.redirect("/home");
  });
});
//Deleting Banner end
let post;
const poster = async () => {
  post = await Slider.find();
  post = JSON.stringify(post);
  post = JSON.parse(post);
};
let ban;
const banner = async () => {
  ban = await Banner.find();
  ban = JSON.stringify(ban);
  ban = JSON.parse(ban);
};

//Contact Us form start
app.post("/contact_us", (req, res) => {
  let email = req.body.Email;
  let name = req.body.name;
  let issue = req.body.message;
  let transporter1 = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ddubey10032003@gmail.com",
      pass: "qcifrzphugnukief",
    },
  });

  transporter1.sendMail(
    {
      from: email,
      to: "ddubey10032002@gmail.com",
      subject: "Issue",
      text: `I am ${name} my  issue is ${issue}`,
    },
    (err, info) => {
      if (err) {
        console.log(err);
        res.redirect("/contact_us");
      } else {
        // console.log(OTP);
        res.redirect("/contact_us");
        //  res.render("otp");
      }
    }
  );
});
//contact us form end

//Navigating among different ejs file in admin panel
app.get("/gallery", async (req, res) => {
  await product().then(() => {
    res.render("gallery", { data1: data });
  });
});
app.get("/Register", (req, res) => {
  res.render("Register");
});
app.get("/productform", (req, res) => {
  res.render("productform");
});
app.get("/Message-sending", async (req, res) => {
  await Message.find().then((msg) => {
    console.log(msg);
    res.render("Message-sending", { msg });
  });
});
app.get("/addslider", async (req, res) => {
  res.render("addslider");
});
app.get("/addbanner", (req, res) => {
  res.render("addbanner");
});
app.get("/otp", (req, res) => {
  res.render("otp");
});
app.get("/back", (req, res) => {
  res.redirect("/Message-sending");
});
//Navigating among different ejs file in user panel
app.get("/home", async (req, res) => {
  await product().then(async () => {
    await poster().then(async () => {
      await banner().then(() => {
        (allData.data = data), (allData.post = post), (allData.ban = ban);
        res.render("index", { allData: allData });
      });
    });
  });
});
let allData = new Object();

app.get("/", async (req, res) => {
  await product().then(async () => {
    await poster().then(async () => {
      await banner().then(() => {
        (allData.data = data), (allData.post = post), (allData.ban = ban);
        res.render("userIndex", { allData: allData });
      });
    });
  });
  //res.render("userIndex", { allData: allData });
});
app.get("/userGallery", async (req, res) => {
  await product().then(() => {
    res.render("userGallery", { data1: data });
  });
});
app.get("/contact_us", (req, res) => {
  res.render("contact_us");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/scan", (req, res) => {
  res.render("scan");
});
