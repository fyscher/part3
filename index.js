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
  console.log('error.name: ', error.name)

  switch (error.name)
  {
    case 'CastError':
      res.status(400).send({ error: 'Malformatted Id' })
      break;
    case 'ValidationError':
      res.status(400).json({ error: error.message })
      break;
    default:
      next(error)
  }
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
  Entry
  .find({})
  .then( entry => res.send(`Total Phonebook entries: ${entry.length}`))
  .catch( error => 
    {
      console.log(error)
      next(error)
    })
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
        next(error)
      }
      )
  })

app.delete('/api/persons/:id', (req, res) =>
{
  Entry
    .findByIdAndDelete(req.params.id)
    .then( result => res.status(204).end())
    .catch( error => next(error) )
})

app.put('/api/persons/:id', (req, res, next) =>
{
  const {name, number} = req.body

  Entry
    .findByIdAndUpdate(req.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
    .then( updatedEntry => res.json(updatedEntry))
    .catch( error => next(error))
  }
)

app.post('/api/persons', (req, res, next) =>
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
    .then( saved => { res.json(saved) })
    .catch( error => { next(error) })
})

app.use(unknownEndpoint)

app.use(errorHandler)

app.listen( PORT, () => console.log(`Server running on port ${PORT}`))
