const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: String,
  image: String,
  description: String
})

const productCollection = mongoose.model("Product", productSchema)

module.exports = productCollection
