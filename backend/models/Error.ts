import mongoose, { Document, Schema } from "mongoose";

export interface IErrorLog extends Document {
  userID: Schema.Types.ObjectId;
  duration?: "WEEK" | "DAY" | "HOUR" | "MONTH";
  message: string;
  status: number;
  responseMessage: string;
  endpoint: string;
  method: string;
  timestamp: Date;
}

const errorLogSchema = new Schema<IErrorLog>({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  duration: {
    type: String,
    enum: ["WEEK", "DAY", "HOUR", "MONTH"],
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  responseMessage: {
    type: String,
    required: false,
  },
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IErrorLog>("ErrorLog", errorLogSchema);
