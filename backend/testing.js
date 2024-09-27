import connectDb from './config/db_config.js';   // Import the connection function
import {User} from './model/mongoSchema.js';   // Import your Mongoose model
import mongoose from 'mongoose';   // Import mongoose to close connection later

const enterData = async () => {
    try {
        // Establish a database connection
        await connectDb();

        // Create a new user document with dummy data
        const dummyData = new User({
            id: 111,
            email: "a@mail.com",
            username: "test user",
            password: "123"
        });

        // Save the new user to the database
        const newUser = await dummyData.save();
        console.log("User successfully saved:", newUser);

    } catch (error) {
        // Handle errors
        console.log("Error:", error.message);

    } finally {
        // Always close the connection once done
        mongoose.connection.close();
    }
};

// Run the function to enter data
enterData();
