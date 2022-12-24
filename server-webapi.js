

require('dotenv').config()
const port = process.env.WEBAPI_PORT || 9999
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const initMongoDB = require('./server-mongodb')
const cors = require('cors')



// middleware
app.use(cors())
app.use(express.urlencoded({ extended : true}))
app.use(bodyParser.json())
app.use(express.json())


// routes
const productController = require('./controller/productController')
app.use('/api/products', productController)


// initializing
initMongoDB()
app.listen(port, () => console.log(`Web-API kör på http://localhost:${port}`))