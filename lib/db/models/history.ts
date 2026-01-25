import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "prompt" | "upload" | "reference";
  prompt?: string;
  title?: string;
  style?: string;
  thumbnails: string[];
  referenceImage?: string;
  uploadedImages?: string[];
  createdAt: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["prompt", "upload", "reference"],
      required: true,
    },
    prompt: {
      type: String,
    },
    title: {
      type: String,
    },
    style: {
      type: String,
    },
    thumbnails: [{
      type: String,
    }],
    referenceImage: {
      type: String,
    },
    uploadedImages: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and sorting by date
HistorySchema.index({ userId: 1, createdAt: -1 });

export const History: Model<IHistory> =
  mongoose.models.History || mongoose.model<IHistory>("History", HistorySchema);
