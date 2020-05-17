const mongoose = require('mongoose')
require('dotenv').config()
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);
const url = process.env.MONGODB_URI
console.log('Connecting to: ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})

personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(p => {
          console.log(`   ${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(() => {
        console.log(`Added ${name} number ${number} to the phonebook`)
        mongoose.connection.close()
    })
}

module.exports = mongoose.model('Person', personSchema)