import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      // Connection URL from MongoDB Atlas
      const dbUrl = 'mongodb+srv://saakethkoduri:QxXpQbfX1jaM0cNM@cluster0.bvuv1ir.mongodb.net/?retryWrites=true&w=majority';
  
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
