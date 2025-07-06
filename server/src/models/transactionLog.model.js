import mongoose from "mongoose";

const transactionLogSchema = new mongoose.Schema(
  {
    pitchId: {
      type: Number,
      required: true,
    },
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: [
        "PITCH_CREATED",
        "INVESTMENT_MADE",
        "MILESTONE_COMPLETED",
        "FUNDS_RELEASED",
        "REFUND_ISSUED",
      ],
    },
    walletAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    blockchainData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    milestoneIndex: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED"],
      default: "PENDING",
    },
    gasUsed: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
transactionLogSchema.index({ pitchId: 1, transactionType: 1 });
transactionLogSchema.index({ startupId: 1 });
transactionLogSchema.index({ walletAddress: 1 });
transactionLogSchema.index({ transactionHash: 1 }, { unique: true });
transactionLogSchema.index({ createdAt: -1 });

const TransactionLog = mongoose.model("TransactionLog", transactionLogSchema);

export default TransactionLog;
