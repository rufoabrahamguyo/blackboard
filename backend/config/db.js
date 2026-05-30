import mongoose from "mongoose";

// Function for database connection
const connectDB = async () => {
  try {
    // Use Mongoose to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`); // Send a message if connection is successful
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop the server if connection fails
  }
};

export default connectDB;