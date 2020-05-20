const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
require('dotenv').config()
const personsRouter = require('./controllers/persons')
mongoose.set('useFindAndModify', false)
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use('/api/persons', personsRouter)
app.use(cors())
app.use(middleware.requestLogger)

const url = config.MONGODB_URI

logger.info('Connecting to: ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  logger.info('connected to MongoDB')
})
.catch((error) => {
  logger.info('error connecting to MongoDB:', error.message)
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        let text = ''
        text += `The phonebook has ${persons.length} contacts <br>`
        text += Date().toString()
        res.send(text)
    })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app