const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to database");
  } catch (err) {
    console.log("Error connecting database ", err.message);
  }
};
module.exports = connectToDatabase;
