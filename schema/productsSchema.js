const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {type: String, require: true},
    description:{type: String},
    price: {type: Number, require: true},
    category: {type: String},
    tag: {type: String},
    imageName: {type: String},
    rating: {type: Number}

})

module.exports = mongoose.model("products", productSchema)
