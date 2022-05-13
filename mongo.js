const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongo.js <password>");
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.zc7eo.mongodb.net/thePhonebookApp?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    console.log(result)
    mongoose.connection.close();
  });
}
