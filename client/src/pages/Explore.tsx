import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, TrendingUp, Users, DollarSign, Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import { useStartup } from '../contexts/StartupContext';

interface StartupProject {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  fundingGoal: string;
  fundingRaised: string;
  foundedDate: string;
  location: string;
  teamSize: number;
  tags: string[];
  logo: string;
  images: string[];
  founder: string;
  website: string;
  pitch: string;
  businessModel: string;
  targetMarket: string;
  competition: string;
  traction: string;
  financials: {
    revenue: string;
    growth: string;
    burn: string;
  };
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { startupProjects } = useStartup();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const industries = ['all', 'CleanTech', 'HealthTech', 'EdTech', 'FinTech', 'AgTech', 'E-commerce'];
  const stages = ['all', 'Pre-Seed', 'Seed', 'Series A', 'Series B'];

  const filteredProjects = startupProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'all' || project.industry === selectedIndustry;
    const matchesStage = selectedStage === 'all' || project.stage === selectedStage;
    
    return matchesSearch && matchesIndustry && matchesStage;
  });

  const handleViewDetails = (project: StartupProject) => {
    navigate(`/startup/${project.id}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-y-auto" style={{paddingTop: '120px', paddingBottom: '40px'}}>
      <div className="min-h-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Explore Startups</h1>
            <p className="text-gray-400">Discover innovative startups and their funding journeys</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search startups, industries, or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Industry Filter */}
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>

              {/* Stage Filter */}
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage === 'all' ? 'All Stages' : stage}
                  </option>
                ))}
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-400">
              Showing {filteredProjects.length} of {startupProjects.length} startups
            </div>
          </div>

          {/* Startup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition-colors">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{project.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                      <p className="text-gray-400 text-sm">{project.industry} • {project.stage}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Raised</p>
                      <p className="text-sm font-semibold text-white">{project.fundingRaised}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Goal</p>
                      <p className="text-sm font-semibold text-white">{project.fundingGoal}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Team</p>
                      <p className="text-sm font-semibold text-white">{project.teamSize} people</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm font-semibold text-white">{project.location.split(',')[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(project)}
                  className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No startups found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default Explore;
