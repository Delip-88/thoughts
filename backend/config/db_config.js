import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const connectDb = async () => {
    try {
        const uri = process.env.MONGO_CLUSTER_URI;
        
        if (!uri) {
            throw new Error('MongoDB URI is not defined. Please check your .env file.');
        }

        // Connect to MongoDB with recommended options
        await mongoose.connect(uri);

        console.log('Connected to the database successfully');
    } catch (err) {
        console.error('Connection to the database failed:', err.message);
        process.exit(1);  // Exit process with failure code
    }
};

export default connectDb;

