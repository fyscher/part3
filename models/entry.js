const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI;

console.log('connecting to: ', url);
mongoose.connect(url)
    .then( () => 
    {
        console.log('connected!')
    })
    .catch( error => 
    {
        console.log('error connecting to url: ', error.message)
    })

const EntrySchema = new mongoose.Schema
({
    name: String,
    number: String,
})

EntrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Entry', EntrySchema)
