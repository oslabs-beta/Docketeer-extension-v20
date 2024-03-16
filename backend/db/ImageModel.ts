import mongoose, { Schema, Document } from "mongoose";


interface Vulnerability extends Document {
  Package: string;
  VersionInstalled: string;
  VulnerabilityID: string;
  Severity: string;
}
const VulnerabilitySchema: Schema<Vulnerability> = new Schema({
  Package: { type: String, required: true },
  VersionInstalled: { type: String, required: true },
  VulnerabilityID: { type: String, required: true },
  Severity: { type: String, required: true },
});

// Type for VulnerabilityCountSchema
interface VulnerabilityCountSchema {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
  Negligible: number;
  Unknown: number;
};
const VulnerabilityCountSchema: Schema<VulnerabilityCountSchema> = new Schema({
  Critical: { type: Number },
  High: { type: Number },
  Medium: { type: Number },
  Low: { type: Number },
  Negligible: { type: Number },
  Unknown: { type: Number },
});

// Type for EverythingSchema
interface EverythingSchema {
  critical: Vulnerability[];
  high: Vulnerability[];
  medium: Vulnerability[];
  low: Vulnerability[];
  negligible: Vulnerability[];
  unknown: Vulnerability[];
};

const EverythingSchema: Schema<EverythingSchema> = new Schema({
  critical: [VulnerabilitySchema],
  high: [VulnerabilitySchema],
  medium: [VulnerabilitySchema],
  low: [VulnerabilitySchema],
  negligible: [VulnerabilitySchema],
  unknown: [VulnerabilitySchema],
});

// Type for Top3ObjSchema
interface Top3ObjSchema {
  critical: [string, number][];
  high: [string, number][];
  medium: [string, number][];
  low: [string, number][];
  negligible: [string, number][];
  unknown: [string, number][];
};

const Top3ObjSchema: Schema<Top3ObjSchema> = new Schema({
  critical: [[String, Number]],
  high: [[String, Number]],
  medium: [[String, Number]],
  low: [[String, Number]],
  negligible: [[String, Number]],
  unknown: [[String, Number]],
});

// MAIN SCHEMA
const ImageSchema: Schema<ImageSchema> = new Schema({
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
      Top3Obj: Top3ObjSchema,
      UniqueSize: { type: String, required: true },
      VirtualSize: { type: String, required: true },
      Vulnerabilities: VulnerabilityCountSchema,
    },
  ],
  timeStamp: { type: String, required: true },
});

// type for ImageSchema
interface ImageSchema {
  imagesList: [
    {
      Containers: string;
      CreatedAt: string;
      CreatedSince: string;
      Digest: string;
      Everything: EverythingSchema,
      ID: string;
      Repository: string;
      ScanName: string;
      SharedSize: string;
      Size: string;
      Tag: string;
      Top3Obj: Top3ObjSchema;
      UniqueSize: string;
      VirtualSize: string;
      Vulnerabilities: VulnerabilityCountSchema;
    },
  ],
  timeStamp: string;
};



export default mongoose.model("ImageModel", ImageSchema);


/*

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