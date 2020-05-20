const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (req, res) => {
  Person.find({}).then(people => {
      res.json(people)
  })
})

personsRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
      if (person){
          res.json(person)
      } else {
          res.status(404).end()
      }
  }).catch(e => next(e))
})

personsRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndRemove(id)
  .then(() => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

personsRouter.post('/', (req, res, next) => {
  const newPerson = new Person({
      name: req.body.name,
      number: req.body.number
  })
  newPerson.save().then( savedPerson => {
      res.json(savedPerson)
  }).catch(e => next(e))
})

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter