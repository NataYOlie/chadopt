import mongoose from "mongoose";

let isConnected = false ; //track the connection status

export const connectToDB = async () => {

    //set up mongoose pour eviter des warnings dans la console
    mongoose.set('strictQuery', true);

    if(isConnected){
        console.log('MongoDB is already connected')
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "chadopt",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected = true;
        console.log("MongoDB connected")

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}