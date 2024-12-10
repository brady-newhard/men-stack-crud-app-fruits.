const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
  name: String,
  isReadyToEat: Boolean,
  price: mongoose.Schema.Types.Decimal128,
});

const Fruit = mongoose.model("Fruit", fruitSchema); 
module.exports = Fruit;