import Investment from "../models/investment.model.js";
import Startup from "../models/startup.model.js";
import User from "../models/user.model.js";

// Get all investments with filtering
export const getInvestments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      investorId,
      startupId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
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
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const investments = await Investment.find(filter)
      .populate('investor', 'name email avatar role')
      .populate('startup', 'name description industry stage fundingGoal logo')
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
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investments'
    });
  }
};

// Get single investment by ID
export const getInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const investment = await Investment.findById(id)
      .populate('investor', 'name email avatar role bio location')
      .populate('startup', 'name description industry stage fundingGoal fundingRaised logo founder');
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment'
    });
  }
};

// Create new investment
export const createInvestment = async (req, res) => {
  try {
    const {
      startup,
      amount,
      currency = 'USD',
      investmentType,
      equityPercentage,
      terms,
      notes,
      dueDate
    } = req.body;

    // Verify startup exists
    const startupDoc = await Startup.findById(startup);
    if (!startupDoc) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    // Verify user is an investor
    const investor = await User.findById(req.user.id);
    if (investor.role !== 'investor') {
      return res.status(403).json({
        success: false,
        message: 'Only investors can create investments'
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
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    await investment.save();

    // Populate for response
    await investment.populate('investor', 'name email avatar');
    await investment.populate('startup', 'name description industry stage');

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: investment
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create investment'
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
        message: 'Investment not found'
      });
    }

    // Check authorization (investor or startup founder can update)
    const startup = await Startup.findById(investment.startup);
    const isInvestor = investment.investor.toString() === req.user.id;
    const isFounder = startup.founder.toString() === req.user.id;

    if (!isInvestor && !isFounder) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this investment'
      });
    }

    // Update investment
    investment.status = status;
    if (notes) investment.notes = notes;
    if (status === 'Completed') investment.completedAt = new Date();

    await investment.save();

    await investment.populate('investor', 'name email avatar');
    await investment.populate('startup', 'name description industry stage');

    res.json({
      success: true,
      message: 'Investment updated successfully',
      data: investment
    });
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update investment'
    });
  }
};

// Get investments by user (investor or founder)
export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let investments;

    if (user.role === 'investor') {
      // Get investments made by this investor
      investments = await Investment.find({ investor: userId })
        .populate('startup', 'name description industry stage fundingGoal logo')
        .sort({ createdAt: -1 });
    } else if (user.role === 'founder') {
      // Get investments in startups founded by this user
      const userStartups = await Startup.find({ founder: userId });
      const startupIds = userStartups.map(s => s._id);
      
      investments = await Investment.find({ startup: { $in: startupIds } })
        .populate('investor', 'name email avatar role')
        .populate('startup', 'name description industry stage')
        .sort({ createdAt: -1 });
    } else {
      investments = [];
    }

    res.json({
      success: true,
      data: investments
    });
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user investments'
    });
  }
};

// Get investment statistics
export const getInvestmentStats = async (req, res) => {
  try {
    const totalInvestments = await Investment.countDocuments();
    const totalAmount = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const statusStats = await Investment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const typeStats = await Investment.aggregate([
      { $group: { _id: "$investmentType", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalInvestments,
        totalAmount: totalAmount[0]?.total || 0,
        statusBreakdown: statusStats,
        typeBreakdown: typeStats
      }
    });
  } catch (error) {
    console.error('Get investment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment statistics'
    });
  }
};
