require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://2rkniemi:${password}@cluster0.is7ckln.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlenght: 1,
        required: true
    },
    number: {
        type: String,
        minlenght: 1,
        required: true
    },
    //id: Number
})

const Person = mongoose.model('Person', personSchema)


switch(process.argv.length){
    case 3:
        console.log("phonebook:")
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person.name + " " + person.number)
            })
            mongoose.connection.close()
        })
        break
    case 4:
        console.log('give name and number')
        process.exit(1)
    case 5:
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4],
            })
    
        person.save().then(result => {
            console.log(`added ${result.name} ${result.number} to phonebook`)
            mongoose.connection.close()
        })
        break
    default:
        console.log('too many arguments')
        process.exit(1)
}
