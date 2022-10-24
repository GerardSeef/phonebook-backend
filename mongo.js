const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://GerardSeef:${password}@cluster0.z38hpt7.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')

      const person = new Person({
        name,
        number
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${name} number ${number} to the phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  mongoose.connect(url)
  Person.find({ }).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
