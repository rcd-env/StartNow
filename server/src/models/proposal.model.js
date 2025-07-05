import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    markdownContent: {
      type: String,
    },
    formData: {
      companyName: String,
      industry: String,
      customIndustry: String,
      problemStatement: String,
      solution: String,
      targetMarket: String,
      businessModel: String,
      fundingAmount: String,
      useOfFunds: String,
      teamStructure: String,
      financialProjections: String,
      marketSegmentation: String,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
    version: {
      type: Number,
      default: 1,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    sharedWith: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      sharedAt: {
        type: Date,
        default: Date.now,
      },
      permissions: {
        type: String,
        enum: ['View', 'Comment', 'Edit'],
        default: 'View',
      },
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { 
    timestamps: true 
  }
);

// Index for search and queries
proposalSchema.index({ creator: 1, startup: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ isPublic: 1 });
proposalSchema.index({ createdAt: -1 });
proposalSchema.index({ 
  title: 'text', 
  content: 'text',
  tags: 'text'
});

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
