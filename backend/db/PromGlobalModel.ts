import mongoose, { Schema, Document } from "mongoose";


// DO NOT CHANGE - SIGNED UP WITH DOCKETEER GMAIL!
// Uncomment if you want to host your scans in the MongoDB cloud account for Docketeer
// Database: docketeer - Collection: imagemodels
// const URI =
//   'mongodb+srv://docketeer:MaIQDkTCJlqyzWNu@docketeerextension.h4ubyyv.mongodb.net/';

/*
If your application inside the Docker container needs to connect to a service on the host machine (in this case, MongoDB),
you can't use localhost in the connection string. localhost inside a Docker container refers to the container itself, not the
host machine.

If you're using Docker Desktop for Mac, you can use host.docker.internal as the hostname to connect to your host machine.
So your MongoDB connection string would look something like this: mongodb://host.docker.internal:27017.
*/

// CONNECTION MADE IN ImageModel.ts

interface PromGlobalDocument extends Document {
  scrapeInterval: string;
  evaluationInterval: string;
}

// Main schema for the 'Prometheus Global Setting' object
const PromGlobalSchema: Schema = new Schema({
  scrapeInterval: { type: String, required: true },
  evaluationInterval: { type: String, required: true },
});

module.exports = mongoose.model<PromGlobalDocument>('PromGlobalModel', PromGlobalSchema);
