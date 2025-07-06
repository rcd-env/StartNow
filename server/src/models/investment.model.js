import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "BTC", "ETH"],
    },
    investmentType: {
      type: String,
      required: true,
      enum: ["Equity", "Convertible Note", "SAFE", "Debt", "Token"],
    },
    equityPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Completed", "Rejected", "Cancelled"],
      default: "Pending",
    },
    terms: {
      type: String,
    },
    notes: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    transactionHash: {
      type: String, // For blockchain transactions
    },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for queries
investmentSchema.index({ investor: 1, startup: 1 });
investmentSchema.index({ status: 1 });
investmentSchema.index({ createdAt: -1 });

const Investment = mongoose.model("Investment", investmentSchema);

export default Investment;
