require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ' '
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
  const date = new Date(Date.now())
  Person.estimatedDocumentCount((err, count) => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date.toUTCString()}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find(req.query).then(result => {
    res.json(result)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({error: 'person not found'})
    }
  })
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'missing name or number'})
  }

  Person.findOne({name: body.name})
    .then(person => {
      if (person) {
        return res.status(400).json({error: 'Person with that name already exists'})
      } else {
        const person = new Person({
          id: generateId(),
          name: body.name,
          number: body.number,
        })

        person
          .save()
          .then(person => {
            console.log(`Added ${person.name} number ${person.number} to phonebook`)
            return res.json(person)
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id

  Person.findByIdAndUpdate(
    id,
    {name: body.name, number: body.number},
    {new: true, runValidators: true}
  )
    .then(result => {
      res.json(result)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({error: 'malformatted id'})
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({error: err.message})
  }

  next(err)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
