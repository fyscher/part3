const mongoose = require('mongoose')

if (process.argv.length < 3)
{
    console.log('give password as argument')
    process.exit(1)
}

const password  = process.argv[2]
const name      = process.argv[3]
const number    = process.argv[4]

const url = `mongodb+srv://fyscherkraal:${password}@fullstackopen.ervetuo.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstackopen`
mongoose.set('strictQuery', false)

mongoose.connect(url)

const EntrySchema = new mongoose.Schema
({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', EntrySchema)

switch (process.argv.length)
{
    case 3:
        console.log('phonebook:')
        Entry.find({}).then( result =>
        {
            result.forEach(entry =>
        {
            console.log(`${entry.name} ${entry.number}`)
        })
        mongoose.connection.close()
        })
        break;
    case 5:
        const entry = new Entry
        ({
            name: name,
            number: number,
        })
        
        entry.save().then(() => 
        {
            console.log(`added ${name}, number: ${number} to the phonebook`)
            mongoose.connection.close()
        })
        break;
    default:
        console.log('invalid number of arguments. please use quotations or no spaces')
        mongoose.connection.close()
}

