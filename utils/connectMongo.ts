import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  const MONGO_URI = process.env.MONGO_URI;
//   console.log(MONGO_URI);

  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
    console.log("Connected to MongoDB");
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectMongo;
