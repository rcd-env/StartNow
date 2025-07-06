import Investment from "../models/investment.model.js";
import Startup from "../models/startup.model.js";
import User from "../models/user.model.js";
import TransactionLog from "../models/transactionLog.model.js";

// Get all investments with filtering
export const getInvestments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      investorId,
      startupId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (investorId) {
      filter.investor = investorId;
    }

    if (startupId) {
      filter.startup = startupId;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const investments = await Investment.find(filter)
      .populate("investor", "name email avatar role")
      .populate("startup", "name description industry stage fundingGoal logo")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Investment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get investments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investments",
    });
  }
};

// Get single investment by ID
export const getInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id)
      .populate("investor", "name email avatar role bio location")
      .populate(
        "startup",
        "name description industry stage fundingGoal fundingRaised logo founder"
      );

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    res.json({
      success: true,
      data: investment,
    });
  } catch (error) {
    console.error("Get investment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investment",
    });
  }
};

// Create new investment
export const createInvestment = async (req, res) => {
  try {
    const {
      startup,
      amount,
      currency = "USD",
      investmentType,
      equityPercentage,
      terms,
      notes,
      dueDate,
    } = req.body;

    // Verify startup exists
    const startupDoc = await Startup.findById(startup);
    if (!startupDoc) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Verify user is an investor
    const investor = await User.findById(req.user.id);
    if (investor.role !== "investor") {
      return res.status(403).json({
        success: false,
        message: "Only investors can create investments",
      });
    }

    const investment = new Investment({
      investor: req.user.id,
      startup,
      amount,
      currency,
      investmentType,
      equityPercentage,
      terms,
      notes,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    await investment.save();

    // Populate for response
    await investment.populate("investor", "name email avatar");
    await investment.populate("startup", "name description industry stage");

    res.status(201).json({
      success: true,
      message: "Investment created successfully",
      data: investment,
    });
  } catch (error) {
    console.error("Create investment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create investment",
    });
  }
};

// Update investment status
export const updateInvestmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    // Check authorization (investor or startup founder can update)
    const startup = await Startup.findById(investment.startup);
    const isInvestor = investment.investor.toString() === req.user.id;
    const isFounder = startup.founder.toString() === req.user.id;

    if (!isInvestor && !isFounder) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this investment",
      });
    }

    // Update investment
    investment.status = status;
    if (notes) investment.notes = notes;
    if (status === "Completed") investment.completedAt = new Date();

    await investment.save();

    await investment.populate("investor", "name email avatar");
    await investment.populate("startup", "name description industry stage");

    res.json({
      success: true,
      message: "Investment updated successfully",
      data: investment,
    });
  } catch (error) {
    console.error("Update investment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update investment",
    });
  }
};

// Get investments by user (investor or founder)
export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let investments;

    if (user.role === "investor") {
      // Get investments made by this investor
      investments = await Investment.find({ investor: userId })
        .populate("startup", "name description industry stage fundingGoal logo")
        .sort({ createdAt: -1 });
    } else if (user.role === "founder") {
      // Get investments in startups founded by this user
      const userStartups = await Startup.find({ founder: userId });
      const startupIds = userStartups.map((s) => s._id);

      investments = await Investment.find({ startup: { $in: startupIds } })
        .populate("investor", "name email avatar role")
        .populate("startup", "name description industry stage")
        .sort({ createdAt: -1 });
    } else {
      investments = [];
    }

    res.json({
      success: true,
      data: investments,
    });
  } catch (error) {
    console.error("Get user investments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user investments",
    });
  }
};

// Get investment statistics
export const getInvestmentStats = async (req, res) => {
  try {
    const totalInvestments = await Investment.countDocuments();
    const totalAmount = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const statusStats = await Investment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const typeStats = await Investment.aggregate([
      { $group: { _id: "$investmentType", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalInvestments,
        totalAmount: totalAmount[0]?.total || 0,
        statusBreakdown: statusStats,
        typeBreakdown: typeStats,
      },
    });
  } catch (error) {
    console.error("Get investment stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investment statistics",
    });
  }
};

// ============ BLOCKCHAIN/APTOS SPECIFIC ENDPOINTS ============

// Create blockchain pitch with milestones
export const createBlockchainPitch = async (req, res) => {
  try {
    const { startupId, milestones, transactionHash, pitchId } = req.body;

    // Find the startup
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Update startup with blockchain data
    startup.blockchainPitchId = pitchId;
    startup.milestones = milestones.map((desc) => ({
      description: desc,
      completed: false,
      completedAt: null,
    }));
    startup.isBlockchainEnabled = true;

    await startup.save();

    // Log the transaction
    await TransactionLog.create({
      pitchId,
      startupId,
      transactionType: "PITCH_CREATED",
      walletAddress: req.body.founderWallet,
      transactionHash,
      status: "CONFIRMED",
      metadata: {
        milestoneCount: milestones.length,
        title: startup.name,
      },
    });

    res.json({
      success: true,
      message: "Blockchain pitch created successfully",
      data: {
        pitchId,
        startup: startup,
      },
    });
  } catch (error) {
    console.error("Create blockchain pitch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blockchain pitch",
    });
  }
};

// Process Aptos investment
export const processAptosInvestment = async (req, res) => {
  try {
    const { startupId, pitchId, amount, walletAddress, transactionHash } =
      req.body;

    // Find the startup
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Check if investor already invested
    const existingInvestor = startup.investors.find(
      (inv) => inv.wallet === walletAddress
    );
    if (existingInvestor) {
      return res.status(400).json({
        success: false,
        message: "Investor has already invested in this startup",
      });
    }

    // Add investor to startup
    startup.investors.push({
      wallet: walletAddress,
      amount: amount,
      investedAt: new Date(),
    });

    // Update escrowed amount
    startup.escrowedAmount += amount;

    await startup.save();

    // Log the transaction
    await TransactionLog.create({
      pitchId,
      startupId,
      transactionType: "INVESTMENT_MADE",
      walletAddress,
      amount,
      transactionHash,
      status: "CONFIRMED",
      metadata: {
        startupName: startup.name,
      },
    });

    res.json({
      success: true,
      message: "Investment processed successfully",
      data: {
        investment: {
          wallet: walletAddress,
          amount,
          startup: startup.name,
        },
        totalEscrowed: startup.escrowedAmount,
      },
    });
  } catch (error) {
    console.error("Process Aptos investment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process investment",
    });
  }
};

// Complete milestone
export const completeMilestone = async (req, res) => {
  try {
    const {
      startupId,
      pitchId,
      milestoneIndex,
      transactionHash,
      founderWallet,
    } = req.body;

    // Find the startup
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Validate milestone index
    if (milestoneIndex >= startup.milestones.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid milestone index",
      });
    }

    // Update milestone
    startup.milestones[milestoneIndex].completed = true;
    startup.milestones[milestoneIndex].completedAt = new Date();

    await startup.save();

    // Log the transaction
    await TransactionLog.create({
      pitchId,
      startupId,
      transactionType: "MILESTONE_COMPLETED",
      walletAddress: founderWallet,
      transactionHash,
      milestoneIndex,
      status: "CONFIRMED",
      metadata: {
        milestoneDescription: startup.milestones[milestoneIndex].description,
        startupName: startup.name,
      },
    });

    res.json({
      success: true,
      message: "Milestone completed successfully",
      data: {
        milestoneIndex,
        milestone: startup.milestones[milestoneIndex],
        completedMilestones: startup.milestones.filter((m) => m.completed)
          .length,
        totalMilestones: startup.milestones.length,
      },
    });
  } catch (error) {
    console.error("Complete milestone error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete milestone",
    });
  }
};

// Release funds to founder
export const releaseFunds = async (req, res) => {
  try {
    const { startupId, pitchId, amount, transactionHash, founderWallet } =
      req.body;

    // Find the startup
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Update released amount
    startup.releasedAmount += amount;

    await startup.save();

    // Log the transaction
    await TransactionLog.create({
      pitchId,
      startupId,
      transactionType: "FUNDS_RELEASED",
      walletAddress: founderWallet,
      amount,
      transactionHash,
      status: "CONFIRMED",
      metadata: {
        startupName: startup.name,
        completedMilestones: startup.milestones.filter((m) => m.completed)
          .length,
        totalMilestones: startup.milestones.length,
      },
    });

    res.json({
      success: true,
      message: "Funds released successfully",
      data: {
        releasedAmount: amount,
        totalReleased: startup.releasedAmount,
        totalEscrowed: startup.escrowedAmount,
        remainingEscrow: startup.escrowedAmount - startup.releasedAmount,
      },
    });
  } catch (error) {
    console.error("Release funds error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to release funds",
    });
  }
};

// Process refund
export const processRefund = async (req, res) => {
  try {
    const { startupId, pitchId, amount, walletAddress, transactionHash } =
      req.body;

    // Find the startup
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Find and remove the investor
    const investorIndex = startup.investors.findIndex(
      (inv) => inv.wallet === walletAddress
    );
    if (investorIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    // Remove investor and update escrowed amount
    startup.investors.splice(investorIndex, 1);
    startup.escrowedAmount -= amount;

    await startup.save();

    // Log the transaction
    await TransactionLog.create({
      pitchId,
      startupId,
      transactionType: "REFUND_ISSUED",
      walletAddress,
      amount,
      transactionHash,
      status: "CONFIRMED",
      metadata: {
        startupName: startup.name,
        reason: "Milestone progress insufficient",
      },
    });

    res.json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refundAmount: amount,
        remainingEscrow: startup.escrowedAmount,
      },
    });
  } catch (error) {
    console.error("Process refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
    });
  }
};

// Get blockchain pitch details
export const getBlockchainPitch = async (req, res) => {
  try {
    const { startupId } = req.params;

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // Get transaction logs for this pitch
    const transactionLogs = await TransactionLog.find({
      startupId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        startup: {
          id: startup._id,
          name: startup.name,
          description: startup.description,
          blockchainPitchId: startup.blockchainPitchId,
          escrowedAmount: startup.escrowedAmount,
          releasedAmount: startup.releasedAmount,
          milestones: startup.milestones,
          investors: startup.investors,
          isBlockchainEnabled: startup.isBlockchainEnabled,
        },
        transactionHistory: transactionLogs,
        stats: {
          totalInvestors: startup.investors.length,
          completedMilestones: startup.milestones.filter((m) => m.completed)
            .length,
          totalMilestones: startup.milestones.length,
          fundingProgress:
            startup.escrowedAmount > 0
              ? (startup.releasedAmount / startup.escrowedAmount) * 100
              : 0,
        },
      },
    });
  } catch (error) {
    console.error("Get blockchain pitch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blockchain pitch details",
    });
  }
};

// Get transaction logs
export const getTransactionLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      pitchId,
      walletAddress,
      transactionType,
    } = req.query;

    const filter = {};
    if (pitchId) filter.pitchId = pitchId;
    if (walletAddress) filter.walletAddress = walletAddress;
    if (transactionType) filter.transactionType = transactionType;

    const logs = await TransactionLog.find(filter)
      .populate("startupId", "name description logo")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TransactionLog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalLogs: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get transaction logs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction logs",
    });
  }
};
