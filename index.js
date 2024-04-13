const express = require('express');
const app = express();

app.use(express.json());

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



const PORT = 3001
app.listen( PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// app.get('/', (req, res) => {
//   res.send(`<h1>Hello World!</h1>`)
// })

// app.get('/api/notes/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const note = notes.find(note => note.id === id)
//   console.log('note ', note)
//   if (note)
//   {
//     res.json(note)
//   } else
//   {
//     res.status(404).end();
//   }
// })

// app.delete('/api/notes/:id', (req, res) =>
// {
//   const id = Number(req.params.id);
//   notes = notes.filter(note => note.id !== id)
  
//   res.status(204).end();
// })

// app.post('/api/notes', (req, res) =>
// {
//   const note = req.body
//   console.log('note ', note)
//   res.json(note)
// })
