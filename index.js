const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [{
        id: 1,
        name: "Arto Hellas",
        number: "413131230012"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "0404012312310"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "400123010203"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "43104120012"
    }
]

app.get('/', (req, res) => {
    res.send('Frontpage')
})

app.get('/info', (req, res) => {
    console.log();
    res.send(`Phonebook has info for ${persons.length} people<br><br>${new Date()}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

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
    const id = Math.floor(Math.random() * (10000000 - 1) + 1);
    return id
}
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.number) {
        return res.status(400).json({
            error: "Number missing"
        })
    }
    if (!body.name) {
        return res.status(400).json({
            error: "Name missing"
        })
    }

    found = persons.find(person => person.name === body.name)

    if (found) {
        return res.status(400).json({
            error: "Name must be unique"
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    res.json(person)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})