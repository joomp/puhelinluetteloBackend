const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
require('dotenv').config()

mongoose.set('useFindAndModify', false)
const app = express()

app.use(express.static('build'))
app.use(express.json()) 
app.use(cors())

app.use(morgan(function (tokens, req, res) {
    let msg=  [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
    if (tokens.method(req, res) == "POST"){
        msg += ' ' + JSON.stringify(req.body)
    }
    return msg
}))
  
app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if (person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ 
          error: 'Name missing' 
        })
    } else if (!req.body.number){
        return res.status(400).json({ 
            error: 'Number missing' 
        })
    } else {
        Person.find({name: req.body.name}).then(person => {
            if (person.length){
                return res.status(400).json({ 
                    error: 'The name is already in the phonebook' 
                })
            }else {
                const newPerson = new Person({
                    name: req.body.name,
                    number: req.body.number
                })
                newPerson.save().then( savedPerson =>{
                    res.json(savedPerson)
                })
            }
        })
    }
})

app.get('/info', (req, res, next) => {
    Person.find({}).then(persons => {
        let text = ''
        text += `The phonebook has ${persons.length} contacts <br>`
        text += Date().toString()
        res.send(text)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updated => {
        response.json(updated)
      })
      .catch(error => next(error))
})
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}
  
app.use(errorHandler)