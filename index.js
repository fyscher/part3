require('dotenv').config()
const express = require('express');
const morgan  = require('morgan');
const cors    = require('cors');
const Entry   = require('./models/entry') 
const PORT    = process.env.PORT

morgan.token('body', req => JSON.stringify(req.body))

const app = express();

const unknownEndpoint = (req, res) =>
{
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) =>
{
  console.error(error.message)

  if (error.name === 'CastError')
  {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'));

app.get('/api/persons', (req, res) =>
{
  Entry
    .find({})
    .then( entry => res.json(entry))
    .catch(error => next(error))
})

app.get('/info', (req, res) =>
{
  res.send(`<p>This phonebook has info for ${persons.length} people.</p><br/><p>${new Date().toUTCString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => 
  {
    Entry
      .findById(req.params.id)
      .then( entry => 
        ! entry
        ? res.status(404).json({ error: 'no entry found' })
        : res.json(entry))
      .catch( error =>
      {
        console.log(error)
        res.status(500).send({ error: 'malformatted id'})
        next(error)
      }
      )
  })

app.delete('/api/persons/:id', (req, res) =>
{
  Entry
    .findByIdAndDelete(req.params.id)
    .then( result => 
      res.status(204).end())
    .catch( error => next(error) )
})

app.put('/api/persons/:id', (req, res) =>
{
  const body = req.body

  const entry = 
  {
    name: body.name,
    number: body.number,
  }

  Entry
    .findByIdAndUpdate(req.params.id, entry, { new: true })
    .then( updatedEntry =>
    {
      res.json(updatedEntry)
    }
    )
    .catch( error => next(error) )
})

app.post('/api/persons', (req, res) =>
{
  const body = req.body;

  const entry = new Entry
  ({
    name: body.name,
    number: body.number,
  })

  ! body.name || ! body.number
  ? res.status(400).json({ error: 'must fill out both fields' })
  : entry
    .save()
    .then( saved =>{ res.json(saved) })
    .catch( error => { next(error) })
})

app.use(unknownEndpoint)

app.use(errorHandler)

app.listen( PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
