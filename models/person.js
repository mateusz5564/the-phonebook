const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB: ', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name is too short (min 3 characters)'],
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    minlength: [8, 'Nubmer is too short'],
    validate: {
      validator: v => {
        return /^[0-9]{2,3}-[0-9]*$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'Number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
