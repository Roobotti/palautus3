require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')
morgan.token('req-body', (req, res) => JSON.stringify(req.body))

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())


app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  NodeIterator.findById(req.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } 
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.get("/info", (req, res) => {
  const txt = 
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>\
      <p>${new Date()}</p>
    </div>`
  res.send(txt)
})

const unknownEndpoint = (request, response) => response.status(404).send({ error: 'unknown endpoint' })
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
