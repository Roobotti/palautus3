require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
morgan.token('req-body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    //id: Number
})

const Person = mongoose.model('Person', personSchema)


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-3939",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-22",
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
    },
  ]

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
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

  const note = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(note)

  res.json(note)
})

app.get("/info", (req, res) => {
  const txt = 
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>\
      <p>${new Date()}</p>
    </div>`
  res.send(txt)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
