import mongoose, { Schema, Document } from "mongoose";

// Sub-schema for the 'Everything' object
const EverythingSchema: Schema = new Schema({
  critical: [{ Package: String, VersionInstalled: String, VulnerabilityID: String, Severity: String }],
  high: [{ Package: String, VersionInstalled: String, VulnerabilityID: String, Severity: String }],
  medium: [{ Package: String, VersionInstalled: String, VulnerabilityID: String, Severity: String }],
  low: [{ Package: String, VersionInstalled: String, VulnerabilityID: String, Severity: String }],
  negligible: [{ Package: String, VersionInstalled: String, VulnerabilityID: String, Severity: String }],
  unknown: [{ Package: String, VersionInstalled: String, VulnerabilityID: String, Severity: String }],
});

// Sub-schema for the 'Top3Obj' object
const Top3ObjSchema: Schema = new Schema({
  critical: [[String, Number]],
  high: [[String, Number]],
  medium: [[String, Number]],
  low: [[String, Number]],
  negligible: [[String, Number]],
  unknown: [[String, Number]],
});

// Sub-schema for the 'Vulnerabilities' object
const VulnerabilitiesSchema: Schema = new Schema({
  Critical: Number,
  High: Number,
  Medium: Number,
  Low: Number,
  Neglibible: Number,
  Unknown: Number,
});

// Main schema for the 'Image' object
const ImageSchema: Schema = new Schema({
  imagesList: [{
    Containers: String,
    CreatedAt: String,
    CreatedSince: String,
    Digest: String,
    Everything: EverythingSchema,
    ID: String,
    Repository: String,
    ScanName: String,
    SharedSize: String,
    Size: String,
    Tag: String,
    Top3Obj: Top3ObjSchema,
    UniqueSize: String,
    VirtualSize: String,
    Vulnerabilities: VulnerabilitiesSchema,
  }],
  timeStamp: String,
});


// interface Vulnerability extends Document {
//   Package: string;
//   VersionInstalled: string;
//   VulnerabilityID: string;
//   Severity: string;
// }

// const VulnerabilitySchema: Schema<Vulnerability> = new Schema({
//   Package: { type: String, required: true },
//   VersionInstalled: { type: String, required: true },
//   VulnerabilityID: { type: String, required: true },
//   Severity: { type: String, required: true },
// });

// // Type for VulnerabilityCountSchema
// interface VulnerabilityCountSchema {
//   Critical: number;
//   High: number;
//   Medium: number;
//   Low: number;
//   Negligible: number;
//   Unknown: number;
// };

// const VulnerabilityCountSchema: Schema<VulnerabilityCountSchema> = new Schema({
//   Critical: { type: Number },
//   High: { type: Number },
//   Medium: { type: Number },
//   Low: { type: Number },
//   Negligible: { type: Number },
//   Unknown: { type: Number },
// });

// // Type for EverythingSchema
// interface EverythingSchema {
//   critical: Vulnerability[];
//   high: Vulnerability[];
//   medium: Vulnerability[];
//   low: Vulnerability[];
//   negligible: Vulnerability[];
//   unknown: Vulnerability[];
// };

// const EverythingSchema: Schema<EverythingSchema> = new Schema({
//   critical: [VulnerabilitySchema],
//   high: [VulnerabilitySchema],
//   medium: [VulnerabilitySchema],
//   low: [VulnerabilitySchema],
//   negligible: [VulnerabilitySchema],
//   unknown: [VulnerabilitySchema],
// });

// // Type for Top3ObjSchema
// interface Top3ObjSchema {
//   critical: [string, number][];
//   high: [string, number][];
//   medium: [string, number][];
//   low: [string, number][];
//   negligible: [string, number][];
//   unknown: [string, number][];
// };

// const Top3ObjSchema: Schema<Top3ObjSchema> = new Schema({
//   critical: [{ type: [String, Number] }],
//   high: [{ type: [String, Number] }],
//   medium: [{ type: [String, Number] }],
//   low: [{ type: [String, Number] }],
//   negligible: [{ type: [String, Number] }],
//   unknown: [{ type: [String, Number] }],
// });

// MAIN SCHEMA
// const ImageSchema: Schema<ImageSchema> = new Schema({
//   imagesList: { type: String, required: true },
//   timeStamp: { type: String, required: true },
// });

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

// type for ImageSchema
// interface ImageSchema {
//   imagesList: string;
//   timeStamp: string;
// };

// interface ImageSchema {
//   imagesList: [
//     {
//       Containers: string;
//       CreatedAt: string;
//       CreatedSince: string;
//       Digest: string;
//       Everything: object,
//       ID: string;
//       Repository: string;
//       ScanName: string;
//       SharedSize: string;
//       Size: string;
//       Tag: string;
//       Top3Obj: [];
//       UniqueSize: string;
//       VirtualSize: string;
//       Vulnerabilities: object;
//     },
//   ],
//   timeStamp: string;
// };

// Define a subdocument schema for each vulnerability






export default mongoose.model("ImageModel", ImageSchema);




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
