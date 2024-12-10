const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require("mongoose");
const app = express();
const Fruit = require("./models/fruit.js");

//--------------CONFIGURE MONGOOSE----------------------//

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//-------------------MIDDLEWARE-------------------------//

//This will provide req.body
app.use(express.urlencoded({ extended: false }));

// -------------------------------CRUD/INDUCE------------------------------//
// GET 
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// Get New
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits/new");
});

//------------------------------Listener-----------------------------------//

app.listen(process.env.PORT, () => {
    console.log(`🎧Listening on http://localhost:${process.env.PORT}`);
})