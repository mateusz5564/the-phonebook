const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(res => {
    console.log("connected to MongoDB");
  })
  .catch(err => {
    console.log("error connecting to MongoDB: ", err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name is too short (min 3 characters)'],
    required: [true, 'Name is required'],
  },
  number: {
    type: Number,
    required: [true, 'Number is required'],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
