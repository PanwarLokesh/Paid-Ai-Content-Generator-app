const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected... ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to database ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
