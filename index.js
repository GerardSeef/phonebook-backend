const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
// app.use(morgan('tiny'))

morgan.token('ob', (req) => {
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :response-time ms :req[header] :ob'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040 - 123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Artur Willingum',
    number: '+5954 3546897 987',
    id: 5
  },
  {
    name: 'Mary Poppendieck',
    number: ' +54687 321654',
    id: 6
  }
]

app.get('/', (request, response) => {
  response.send('<h1>"Hello World"</h1>')
})

app.get('/info', (request, response) => {
  const utcDate1 = new Date(Date.now())
  response.send(`<p> Phonebook has info for ${persons.length} people </p> <p> ${utcDate1.toUTCString()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(n => n.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name) {
    return response.status(400).json({
      error: 'name missig'
    })
  }

  if (!person.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  console.log(persons.some((p) => p.name === person.name))
  if (persons.some((p) => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const ids = persons.map(n => n.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    name: person.name,
    number: person.number,
    id: maxId + 1
  }

  persons = [...persons, newPerson]

  response.status(201).json(newPerson)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
