require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./model/person')
const errorHandler = require('./middelware/errorHandler')
const unknownEndpoint = require('./middelware/unknownEndpoint')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('ob', (req) => {
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :response-time ms :req[header] :ob'))

app.get('/', (request, response) => {
  response.send('<h1>"Hello World"</h1>')
})

app.get('/info', (request, response, next) => {
  const utcDate = new Date(Date.now())
  Person.find({})
    .then((persons) => {
      response.send(
        `<p> Phonebook has info for ${persons.length} people </p> <p> ${utcDate}</p></p>`
      )
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name,
    number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
