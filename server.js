const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require("mongoose");
const app = express();
const Fruit = require("./models/fruit.js");
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
//--------------CONFIGURE MONGOOSE----------------------//

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//-------------------MIDDLEWARE-------------------------//

//This will provide req.body
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new
// -------------------------------CRUD/INDUCE------------------------------//
// GET 
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

//INDUCES

// GET /fruits
app.get("/fruits", async (req, res) => {
  try {
  const allFruits = await Fruit.find();
  res.render("fruits/index.ejs", { fruits: allFruits });
  } catch {
    res.render("fruits/index.ejs", { fruits: [], errorMsg: "Something went wrong, please try again soon." });
  }
});

// Get New
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// Delete
// app.delete("/fruits/:fruitId", (req, res) => {
//   res.send("This is the delete route");
// });
app.delete("/fruits/:fruitId", async (req, res) => {
  // Query & Delete
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

// PUT /fruits/:fruitId
app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});

// POST /fruits (create)
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits"); // redirect to index fruits
});

// GET localhost:3000/fruits/:fruitId/edit
// app.get("/fruits/:fruitId/edit", async (req, res) => {
//   const foundFruit = await Fruit.findById(req.params.fruitId);
//   console.log(foundFruit);
//   res.send(`This is the edit route for ${foundFruit.name}`);
// });
app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

// GET /fruits/:fruitId (show)
// app.get("/fruits/:fruitId", (req, res) => {
//   res.send(
//     `This route renders the show page for fruit id: ${req.params.fruitId}!`
//   );
// });
app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  //res.send(`This route renders the show page for fruit id: ${req.params.fruitId}!`);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});


//------------------------------Listener-----------------------------------//

app.listen(process.env.PORT, () => {
    console.log(`🎧Listening on http://localhost:${process.env.PORT}`);
})