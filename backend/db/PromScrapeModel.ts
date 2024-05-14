// Model to store Scrape Configs after reading it off of prometheus.yaml file
// Click on export button on Configuration Page for functionality

import mongoose, { Schema, Document } from 'mongoose';

interface PromScrapeModel extends Document {
  honor_labels: boolean;
  job_name: string;
  metrics_path: string;
  params: {};
  relabel_configs: [];
  scrape_interval: string;
  evaluation_interval: string;
  static_configs: [];
}

// Main schema for the 'Prometheus Scrape Configs Setting' object
const PromScrapeSchema: Schema = new Schema({
  honor_labels: { type: Boolean, required: false },
  job_name: { type: String, required: false },
  metrics_path: { type: String, required: false },
  params: { type: Object, required: false },
  relabel_configs: { type: Array, required: false, default: undefined },
  scrape_interval: { type: String, required: false },
  evaluation_interval: { type: String, required: false },
  static_configs: { type: Array, required: false, default: undefined },
});

module.exports = mongoose.model<PromScrapeModel>('PromScrapeModel', PromScrapeSchema);
