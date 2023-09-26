const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/crudDB'

const connectToMongo = async () => {
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  };

module.exports = connectToMongo;