const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require("./models/person")

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
    Person.countDocuments({})
    .then(result => {
        res.send(`Phonebook has info for ${result} people<br><br>${new Date()}`)
    })
    
})

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
    .catch(error => {
        next(error)
    })
    
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))


})
const generateId = () => {
    const id = Math.floor(Math.random() * (10000000 - 1) + 1);
    return id
}
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    found = persons.find(person => person.name === body.name)

    if (found) {
        return res.status(400).json({
            error: "Name must be unique"
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({
            error: 'malformatted id'
        })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})