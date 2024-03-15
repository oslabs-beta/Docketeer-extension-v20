import mongoose, { Schema, Document } from 'mongoose';

interface Vulnerability {
  Package: string;
  VersionInstalled: string;
  VulnerabilityID: string;
  Severity: string;
}

const VulnerabilitySchema: Schema = new Schema({
  Package: String,
  VersionInstalled: String,
  VulnerabilityID: String,
  Severity: String,
});

const EverythingSchema: Schema = new Schema({
  critical: [VulnerabilitySchema],
  high: [VulnerabilitySchema],
  medium: [VulnerabilitySchema],
  low: [VulnerabilitySchema],
  negligible: [VulnerabilitySchema],
  unknown: [VulnerabilitySchema],
});

// TODO: FIX TOP 3 SCHEMA
const Top3ObjSchema: Schema = new Schema({
  critical: { type: Array },
  high: { type: Array },
  medium: { type: Array },
  low: { type: Array },
  negligible: { type: Array },
  unknown: { type: Array },
});

// MAIN SCHEMA
const ImageSchema: Schema = new Schema({
  imagesList: [
    {
      Containers: { type: String, required: true },
      CreatedAt: { type: String, required: true },
      CreatedSince: { type: String, required: true },
      Digest: { type: String, required: true },
      Everything: EverythingSchema,
      ID: { type: String, required: true },
      Repository: { type: String, required: true },
      ScanName: { type: String, required: true },
      SharedSize: { type: String, required: true },
      Size: { type: String, required: true },
      Tag: { type: String, required: true },
      Top3Obj: EverythingSchema, // obj [[string,number]]
      UniqueSize: { type: String, required: true },
      VirtualSize: { type: String, required: true },
      Vulnerabilities: { type: Object, required: true },
    },
  ],
  timeStamp: { type: String, required: true },
});



// const ImageSchema = new Schema({
//   imagesList: [
//     {
//       Containers: { type: String, required: true },
//       CreatedAt: { type: String, required: true },
//       CreatedSince: { type: String, required: true },
//       Digest: { type: String, required: true },
//       Everything: {
//         critical: { type: Array, required: false },
//         high: { type: Array, required: false },
//         medium: { type: Array, required: false },
//         low: { type: Array, required: false },
//         negligible: { type: Array, required: false },
//         unknown: { type: Array, required: false },
//       },
//       ID: { type: String, required: true },
//       Repository: { type: String, required: true },
//       ScanName: { type: String, required: true },
//       SharedSize: { type: String, required: true },
//       Size: { type: String, required: true },
//       Tag: { type: String, required: true },
//       Top3Obj: {
//         critical: [{
//           Package: { type: String},
//           VersionInstalled: { type: String},
//           VulnerabilityID: { type: String},
//           Severity: { type: String}
//         }],
//         high: [{
//           Package: { type: String},
//           VersionInstalled: { type: String},
//           VulnerabilityID: { type: String},
//           Severity: { type: String}
//         }],
//         medium: [{
//           Package: { type: String},
//           VersionInstalled: { type: String},
//           VulnerabilityID: { type: String},
//           Severity: { type: String}
//         }],
//         low: [{
//           Package: { type: String},
//           VersionInstalled: { type: String},
//           VulnerabilityID: { type: String},
//           Severity: { type: String}
//         }],
//         negligible: [{
//           Package: { type: String},
//           VersionInstalled: { type: String},
//           VulnerabilityID: { type: String},
//           Severity: { type: String}
//         }],
//       },unknown: [{
//           Package: { type: String},
//           VersionInstalled: { type: String},
//           VulnerabilityID: { type: String},
//           Severity: { type: String}
//         }],
//       UniqueSize: { type: String, required: true },
//       VirtualSize: { type: String, required: true },
//       Vulnerabilities: { 
//         type: Object, required: true },
//     },
//   ],
//   timeStamp: { type: String, required: true },
// });


/* --> Pass in Image Reducer states {
	imagesList: [7 things here],
	timeStamp: '',
};

  - Example: SAVE #1 - time x
ImageStateType {
  imagesList:(7) [
    {0: 
      Containers: "N/A",
      CreatedAt: "2024-03-14 19:39:05 +0000 UTC",
      CreatedSince: "23 hours ago",
      Digest: "<none>",
      Everything: {critical: [{Package: 'node', Version Installed: '18.12.1', Vulnerability ID: 'CVE-2023-32002', Severity: 'Critical'}], high: [{},...], medium: [{},...], low: [{},...], negligible: [{},...], unknown: [{},...]}
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




  - Example: SAVE #2 - time y
IMAGE LIST:(7) [...]

*/





// store the image list as one document
// one document, one saved scan
// imageList will have all the information that we need
// matter of pulling from that doc and putting it on the timelapse chart
    

export default mongoose.model('ImageModel', ImageSchema);