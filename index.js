let persons = [
    {
        "name": "Arto Hellas",
        "number": "848-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json()) 

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

app.get('/', (req, res) => {
    res.send('<h1>Hello there</h1>')
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find( p => p.id === Number(id))
    if (person){
        res.json(person)
    } else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter( p => p.id !== Number(id))
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ 
          error: 'Name missing' 
        })
    } else if (!req.body.number){
        return res.status(400).json({ 
            error: 'Number missing' 
        })
    } else if (persons.find(p => p.name === req.body.name)){
        return res.status(400).json({ 
            error: 'The name is already in the phonebook' 
        })
    }

    const person = {
        name: req.body.name,
        number: req.body.number,
        id: getRandomInt(10000000)
    }
    persons = persons.concat(person)
    res.json(person)
})

app.get('/info', (req, res) => {
    let text = ''
    text += `The phonebook has ${persons.length} contacts <br>`
    text += Date().toString()
    res.send(text)
})
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}