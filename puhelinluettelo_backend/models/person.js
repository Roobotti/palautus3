const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
      type: String,
      minlength: 3,
      required: true
  },
  number: {
      type: String,
      validate: {
        validator: function(value) {
          return /^(\d{2,3}-\d+)$/.test(value)
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      minlength: 8,
      required: true
  },
    //id: Number
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)