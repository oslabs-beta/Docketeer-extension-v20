import { IncomingMessage } from "http";
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

// USE LOCAL HOST INSTEAD OF CLOUD ATLAS
const URI = 'mongodb://host.docker.internal:27017'

mongoose
  .connect(
    URI,
    {
      dbName: 'docketeer'
    }
  )
  .then(() => console.log("Connected to Mongo DB."))
  .catch((err) => console.log(err));

interface ImageDocument extends Document {
  userIP: string;
  imagesList: [];
  timeStamp: string;
}

// Main schema for the 'Image' object
const ImageSchema: Schema = new Schema({
	userIP: { type: String, required: true },
  imagesList: { type: Array, required: true },
	timeStamp: { type: String, required: true },
});

module.exports = mongoose.model<ImageDocument>('ImageModel', ImageSchema);


/* This is what document stored in Mongodb looks like

ImageStateType {
  imagesList:(7) [
    {0:
      Containers: "N/A",
      CreatedAt: "2024-03-14 19:39:05 +0000 UTC",
      CreatedSince: "23 hours ago",
      Digest: "<none>",
      Everything: {critical: [{Package: 'node', Version Installed: '18.12.1', Vulnerability ID: 'CVE-2023-32002', Severity: 'Critical'}], high: [], medium: [], low: [], negligible: [], …},
      ID: "98025d5af9a5",
      Repository: "extension-docketstringeer",
      ScanName: "extension-docketeer:latest",
      SharedSize: "N/A",
      Size: "1.7GB",
      Tag: "latest",
      Top3Obj: {critical: [['package', 3]], high: [['package', 13]], medium: [['package', 20]], low: [['package', 4]], negligible: [['package', 1]]},
      UniqueSize: "N/A",
      VirtualSize: "1.699GB",
      Vulnerabilities: {Medium: 33, High: 31, Critical: 1, Unknown: 20},
   ],
  timeStamp: 'Last-Scan-Time'
}

*/
