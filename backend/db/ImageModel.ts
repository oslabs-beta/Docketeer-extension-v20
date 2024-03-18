import { IncomingMessage } from "http";
import mongoose, { Schema, Document } from "mongoose";

// DO NOT CHANGE - SIGNED UP WITH DOCKETEER GMAIL!
// Database: docketeer - Collection: imagemodels
const URI =
  'mongodb+srv://docketeer:MaIQDkTCJlqyzWNu@docketeerextension.h4ubyyv.mongodb.net/';
  
// const URI = 'mongodb://localhost:27017';
// const URI = 'mongodb://127.0.0.1:27017';

// https://www.mongodb.com/docs/manual/core/gridfs/
// Storing using GridFS --> divide into smaller chunks
// Youtube: https://www.youtube.com/watch?v=3f5Q9wDePzY

/**
 *  "413 Request Entity Too Large" error
 *  Article: https://blog.hubspot.com/website/413-request-entity-too-large
 */

mongoose
	.connect(URI, {
    dbName: 'docketeer', // sets the name of the DB
	})
	.then(() => console.log('Connected to Mongo DB.'))
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


// const ImageSchema: Schema<ImageSchema> = new Schema({
//   imagesList: [
//     {
//       Containers: { type: String, required: true },
//       CreatedAt: { type: String, required: true },
//       CreatedSince: { type: String, required: true },
//       Digest: { type: String, required: true },
//       Everything: { type: Object, required: true },
//       ID: { type: String, required: true },
//       Repository: { type: String, required: true },
//       ScanName: { type: String, required: true },
//       SharedSize: { type: String, required: true },
//       Size: { type: String, required: true },
//       Tag: { type: String, required: true },
//       Top3Obj: { type: Array },
//       UniqueSize: { type: String, required: true },
//       VirtualSize: { type: String, required: true },
//       Vulnerabilities: { type: Object, required: true },
//     },
//   ],
//   timeStamp: { type: String, required: true },
// });


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
    }, {1:…}, {2:…}, {3:…}, {4:…}, {5:…}, {6:…}
  ],
  timeStamp: 'Last-Scan-Time'
}

*/
