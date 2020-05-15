const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('- Give password to print all the contacts')
    console.log('- Give password, name and number to add a contact')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Fullstack:${password}@cluster0-1o7w7.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(p => {
          console.log(`   ${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length == 5){
    const name = process.argv[3]
    const number = process.argv[4]
    
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(response => {
        console.log(`Added ${name} number ${number} to the phonebook`)
        mongoose.connection.close()
    })
}
