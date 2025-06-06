import mongoose from "mongoose";

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "UBER" })
    .then(() => console.log("Connect with dB"))
    .catch(() => console.log("Error in Connecting with Db"));
}


export default connectDB;