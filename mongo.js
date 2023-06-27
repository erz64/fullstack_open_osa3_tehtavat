const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as agrument')
    process.exit(1)
}

const password = process.argv[2]
const personAdded = process.argv[3]
const numberAdded = process.argv[4]


const url = `mongodb+srv://erz64:${password}@fs.s9boyg7.mongodb.net/peopleApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: personAdded,
    number: numberAdded
})

if (personAdded && numberAdded) {
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

else {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
}