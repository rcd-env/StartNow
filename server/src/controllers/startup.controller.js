import Startup from "../models/startup.model.js";
import User from "../models/user.model.js";

// Get all startups with filtering and pagination
export const getStartups = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      industry,
      stage,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (industry) {
      filter.industry = industry;
    }
    
    if (stage) {
      filter.stage = stage;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const startups = await Startup.find(filter)
      .populate('founder', 'name email avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Startup.countDocuments(filter);

    res.json({
      success: true,
      data: {
        startups,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get startups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch startups'
    });
  }
};

// Get single startup by ID
export const getStartup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const startup = await Startup.findById(id)
      .populate('founder', 'name email avatar bio location website linkedin twitter');
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    // Increment view count
    startup.views += 1;
    await startup.save();

    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch startup'
    });
  }
};

// Create new startup
export const createStartup = async (req, res) => {
  try {
    const {
      name,
      description,
      industry,
      stage,
      fundingGoal,
      location,
      teamSize,
      tags,
      website,
      pitch,
      businessModel,
      targetMarket,
      competition,
      traction,
      financials
    } = req.body;

    // Get founder info
    const founder = await User.findById(req.user.id);
    if (!founder) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const startup = new Startup({
      name,
      description,
      industry,
      stage,
      fundingGoal,
      location,
      teamSize,
      tags: tags || [],
      website,
      pitch,
      businessModel,
      targetMarket,
      competition,
      traction,
      financials: financials || {},
      founder: req.user.id,
      founderName: founder.name
    });

    await startup.save();

    // Populate founder info for response
    await startup.populate('founder', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Startup created successfully',
      data: startup
    });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create startup'
    });
  }
};

// Update startup
export const updateStartup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const startup = await Startup.findById(id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    // Check if user is the founder
    if (startup.founder.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this startup'
      });
    }

    // Update startup
    Object.assign(startup, req.body);
    await startup.save();

    await startup.populate('founder', 'name email avatar');

    res.json({
      success: true,
      message: 'Startup updated successfully',
      data: startup
    });
  } catch (error) {
    console.error('Update startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update startup'
    });
  }
};

// Delete startup
export const deleteStartup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const startup = await Startup.findById(id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    // Check if user is the founder
    if (startup.founder.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this startup'
      });
    }

    // Soft delete by setting isActive to false
    startup.isActive = false;
    await startup.save();

    res.json({
      success: true,
      message: 'Startup deleted successfully'
    });
  } catch (error) {
    console.error('Delete startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete startup'
    });
  }
};

// Get startups by founder
export const getStartupsByFounder = async (req, res) => {
  try {
    const { founderId } = req.params;
    
    const startups = await Startup.find({ 
      founder: founderId, 
      isActive: true 
    })
    .populate('founder', 'name email avatar')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: startups
    });
  } catch (error) {
    console.error('Get startups by founder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch startups'
    });
  }
};
