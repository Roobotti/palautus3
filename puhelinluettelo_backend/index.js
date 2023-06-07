require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')
morgan.token('req-body', (req) => JSON.stringify(req.body))

const requestLogger = (request, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      }
      else {
        res.status(404).end()
      }
    })
    .catch( error => next(error) )
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch( error => next(error) )
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    id: generateId(),
    name: name,
    number: number,
  })

  person.save(
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {

    const txt =
      `<div>
        <p>Phonebook has info for ${persons.length} people</p>\
        <p>${new Date()}</p>
      </div>`

    res.send(txt)
  })
})

const unknownEndpoint = (request, response) => response.status(404).send({ error: 'unknown endpoint' })
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json(
      { error: error.message }
    )
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
