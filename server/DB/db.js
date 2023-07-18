import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
      // Connection URL from MongoDB Atlas
      const dbUrl = process.env.DATABASE_URL;

      // Connect to MongoDB Atlas
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
    }
  };
  
  export default connectDB;
