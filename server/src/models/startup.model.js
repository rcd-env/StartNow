import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
      enum: [
        "Pre-Seed",
        "Seed",
        "Series A",
        "Series B",
        "Series C",
        "Growth",
        "IPO",
      ],
    },
    fundingGoal: {
      type: String,
      required: true,
    },
    fundingRaised: {
      type: String,
      default: "$0",
    },
    foundedDate: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    logo: {
      type: String,
      default: "🚀",
    },
    images: [
      {
        type: String,
      },
    ],
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    founderName: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    pitch: {
      type: String,
    },
    businessModel: {
      type: String,
    },
    targetMarket: {
      type: String,
    },
    competition: {
      type: String,
    },
    traction: {
      type: String,
    },
    financials: {
      revenue: {
        type: String,
        default: "$0",
      },
      growth: {
        type: String,
        default: "0%",
      },
      burn: {
        type: String,
        default: "$0/month",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    // Blockchain/Aptos related fields
    blockchainPitchId: {
      type: Number,
      default: null,
    },
    escrowedAmount: {
      type: Number,
      default: 0,
    },
    releasedAmount: {
      type: Number,
      default: 0,
    },
    milestones: [
      {
        description: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
          default: null,
        },
        _id: false,
      },
    ],
    investors: [
      {
        wallet: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        investedAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
    contractAddress: {
      type: String,
      default: null,
    },
    isBlockchainEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for funding percentage
startupSchema.virtual("fundingPercentage").get(function () {
  const goal = parseFloat(this.fundingGoal.replace(/[$,M]/g, ""));
  const raised = parseFloat(this.fundingRaised.replace(/[$,M]/g, ""));
  return goal > 0 ? Math.round((raised / goal) * 100) : 0;
});

// Index for search functionality
startupSchema.index({
  name: "text",
  description: "text",
  industry: "text",
  tags: "text",
});

const Startup = mongoose.model("Startup", startupSchema);

export default Startup;
