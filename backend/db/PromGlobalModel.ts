// Model to store Global Configs after reading it off of prometheus.yaml file
// Click on export button on Configuration Page for functionality

import mongoose, { Schema, Document } from "mongoose";

interface PromGlobalDocument extends Document {
  scrape_interval: string;
  evaluation_interval: string;
}

// Main schema for the 'Prometheus Global Setting' object
const PromGlobalSchema: Schema = new Schema({
  scrape_interval: { type: String, required: false },
  evaluation_interval: { type: String, required: false },
});

module.exports = mongoose.model<PromGlobalDocument>('PromGlobalModel', PromGlobalSchema);
