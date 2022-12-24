const express = require('express')
const controller = express.Router()
const productsSchema = require('../schema/productsSchema')
let products = require('../data/Database')
let request = require('request');



controller.param("id",  (request, response, next, id) => {
    request.product = products.find(product => product.id == id)
    next()

})
controller.param('tag', (request, response, next, tag) => {
    request.products = products.filter(product => product.tag == tag)
    next()
})



// GET Alla PRODUKTER //
controller.get('/', async (request, response) => {
    const products = []
    const list = await productsSchema.find()
    if(list){
        for(let product of list){
            products.push({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating,
            })
        }
        response.status(200).json(products)
    } else
        response.status(400).json()
})



// HÄMTA TAG //
controller.get('/:tag', async (request, response) => {
    const products = []
    const list = await productsSchema.find({ tag: request.params.tag })
    if(list){
        for(let product of list){
            products.push({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating,
            })
        }
        response.status(200).json(products)
    } else
        response.status(400).json()
})



// HÄMTA BELOPP PRODUKTER //
controller.get('/:tag/take=:amount', async (request, response) => {
    const products = []
    const list = await productsSchema.find({ tag: request.params.tag }).limit(request.params.amount)
    if(list){
        for(let product of list){
            products.push({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating,
            })
        }   
        response.status(200).json(products)
    } else
        response.status(400).json()
})



// HÄMTA SPECIFIKT ANTAL PRODUKTER //
controller.get('/details/:id', async (request, response) => {
    const product = await productsSchema.findById(request.params.id)
    if(product){
        response.status(200).json({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating,          
        })
    } else
        response.status(404).json()
})



// SECURED ROUTES
// skapa och posta Produkter
controller.post('/', async (request, response) => {

    const { name, description, price, category, tag, imageName, rating } = request.body

    if( !name || !price )
        response.status(400).json({text: 'Namn och pris är nödig.'})

    const product_exists = await productsSchema.findOne({name})
    if(product_exists)
        response.status(409).json({text: 'Ett product med samma namn existerar redan'})
    else{
        const product = await productsSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating,
        })
        if(product)
            response.status(201).json({text: `Det product med ID ${product._id} skapades framgångsrikt.`})
        else
            response.status(400).json({text: 'Något gick fel, vi försöker att skapa produkten.'})
    }
})



// UPPDATERA OCH SÄTTA PRODUKTEN
controller.put('/details/:id', async (request, response) => {

    const id = request.params.id
    const updates =
    {
        name: request.body.name,
        price: request.body.price,
        category: request.body.category,
        imageName: request.body.imageName,
    }

    const product = await productsSchema.findByIdAndUpdate(id, updates, { new: true})

    if(product)
        response.status(200).json(product)
    else
        response.status(404).json({text: `Det product med ID ${request.params.id} ej finns.`})
})



// Ta bort Produkter
controller.delete('/details/:id', async (request, response) => {

    if(!request.params.id)
        response.status(400).json('Inget ID specificerad.')
    else{
        const product = await productsSchema.findById(request.params.id)

        if(product){
            await productsSchema.deleteOne(product)
            response.status(200).json({text: `Det product med ID ${request.params.id} raderades framgångsrikt.`})
        } else{
            response.status(404).json({text: `Det product med ID ${request.params.id} ej finns.`})
        }
    } 
})

module.exports = controller

