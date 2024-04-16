const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', req => JSON.stringify(req.body))


const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) =>
{
  res.json(persons)
})

app.get('/info', (req, res) =>
{
  res.send(`<p>This phonebook has info for ${persons.length} people.</p><br/><p>${new Date().toUTCString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = persons.find(p => p.id === id)
  if (p)
  {
    res.json(p)
  } else
  {
    res.status(404).send(`<h1>Error 404: Not Found</h1>`);
  }
})

app.delete('/api/persons/:id', (req, res) =>
{
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id)
  res.status(204).end();
})

app.post('/api/persons', (req, res) =>
{
  const person = req.body;
  const id = Math.floor(Math.random() * 1000000)
  person["id"] = id;
  console.log(req)
  
  if (person["name"] && person["number"])
  {
    if (persons.map(p => p.id).find(i => i === person.id))
    {
      res.status(409).send(`error 409: person already exists in database`)
    } else
    {
      res.json(person)
    }
  } else
  {
    res.status(400).send(`error 400: please include required information`)
  }
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
