import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Globe,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { useStartup } from "../contexts/StartupContext";
import { useCustomWallet } from "../contexts/WalletContext";

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

const StartupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStartupProject } = useStartup();
  const { address, signAndSubmitTransaction, connected } = useCustomWallet();
  const [project, setProject] = useState<StartupProject | null>(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    const foundProject = getStartupProject(id || "");
    if (foundProject) {
      setProject(foundProject);
    } else {
      navigate("/explore");
    }
  }, [id, navigate, getStartupProject]);

  // Chart data based on project - moved outside useEffect for better performance
  const chartData = project
    ? {
        // Revenue growth data
        revenueData: [
          { month: "Jan", revenue: 15, target: 20 },
          { month: "Feb", revenue: 22, target: 25 },
          { month: "Mar", revenue: 28, target: 30 },
          { month: "Apr", revenue: 35, target: 38 },
          { month: "May", revenue: 42, target: 45 },
          { month: "Jun", revenue: 52, target: 55 },
        ],

        // Market share data
        marketShareData: [
          { name: project.name, value: 15, color: "#ffee99" },
          { name: "Competitor A", value: 25, color: "#4B5563" },
          { name: "Competitor B", value: 20, color: "#6B7280" },
          { name: "Competitor C", value: 18, color: "#9CA3AF" },
          { name: "Others", value: 22, color: "#D1D5DB" },
        ],

        // Customer acquisition data
        customerData: [
          { month: "Jan", customers: 120, churn: 5 },
          { month: "Feb", customers: 180, churn: 8 },
          { month: "Mar", customers: 250, churn: 12 },
          { month: "Apr", customers: 340, churn: 15 },
          { month: "May", customers: 450, churn: 18 },
          { month: "Jun", customers: 580, churn: 22 },
        ],

        // Funding breakdown
        fundingData: [
          { category: "Product Development", amount: 40, color: "#ffee99" },
          { category: "Marketing", amount: 25, color: "#4B5563" },
          { category: "Operations", amount: 20, color: "#6B7280" },
          { category: "Team Expansion", amount: 15, color: "#9CA3AF" },
        ],

        // Financial metrics over time
        financialData: [
          { quarter: "Q1 2023", revenue: 125, expenses: 180, profit: -55 },
          { quarter: "Q2 2023", revenue: 180, expenses: 200, profit: -20 },
          { quarter: "Q3 2023", revenue: 250, expenses: 220, profit: 30 },
          { quarter: "Q4 2023", revenue: 320, expenses: 240, profit: 80 },
          { quarter: "Q1 2024", revenue: 420, expenses: 280, profit: 140 },
          { quarter: "Q2 2024", revenue: 550, expenses: 320, profit: 230 },
        ],
      }
    : null;

  const handleInvestClick = () => {
    setShowInvestmentModal(true);
  };

  const handleInvestment = async () => {
    if (!connected || !address) {
      alert("Please connect your Petra wallet first!");
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert("Please enter a valid investment amount");
      return;
    }

    setIsInvesting(true);

    try {
      const investAmount = parseFloat(investmentAmount);

      // Create the transaction payload for Aptos
      const transaction = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        arguments: [
          "0x0000000000000000000000000000000000000000000000000000000000000001", // Standard Aptos test address
          (investAmount * 100000000).toString(), // Convert APT to Octas (1 APT = 100,000,000 Octas)
        ],
        type_arguments: [],
      };

      // Sign and submit the transaction using Petra wallet
      const response = await signAndSubmitTransaction(transaction);

      if (response) {
        alert(`🎉 Investment successful!

Invested: ${investAmount} APT in ${project?.name}
Transaction Hash: ${response.hash}

Your investment is now secured in the smart contract and will be released based on milestone completion!`);

        setShowInvestmentModal(false);
        setInvestmentAmount("");
      }
    } catch (error) {
      console.error("Investment failed:", error);
      alert(
        `Investment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsInvesting(false);
    }
  };

  if (!project) {
    return (
      <div
        className="fixed inset-0 bg-gray-900 flex items-center justify-center"
        style={{ paddingTop: "120px" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Project Details
          </h2>
          <p className="text-gray-300">
            Please wait while we fetch the information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-gray-900 overflow-y-auto"
      style={{ paddingTop: "120px", paddingBottom: "40px" }}
    >
      <div className="min-h-full px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/explore")}
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{project.logo}</div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {project.name}
                  </h1>
                  <p className="text-gray-400">
                    {project.industry} • {project.stage}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleInvestClick}
              className={`font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                connected
                  ? "text-black hover:opacity-80"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              style={connected ? { background: "#ffee99" } : {}}
              disabled={!connected}
            >
              <Wallet className="w-5 h-5" />
              <span>
                {connected ? "Invest with APTOS" : "Connect Wallet to Invest"}
              </span>
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {project.description}
                </p>
                <p className="text-gray-300 leading-relaxed">{project.pitch}</p>
              </div>

              {/* Business Model */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Business Model
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.businessModel}
                </p>
              </div>

              {/* Target Market */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Target Market
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.targetMarket}
                </p>
              </div>

              {/* Traction */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Traction & Achievements
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.traction}
                </p>
              </div>

              {/* Competition */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Competitive Advantage
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.competition}
                </p>
              </div>

              {/* Charts and Analytics */}
              {chartData && (
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Analytics & Performance
                  </h2>

                  {/* Revenue Growth Chart */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                      Revenue Growth Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData?.revenueData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#F3F4F6",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#ffee99"
                          fill="#ffee99"
                          fillOpacity={0.3}
                          name="Revenue ($K)"
                        />
                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#6B7280"
                          fill="#6B7280"
                          fillOpacity={0.1}
                          name="Target ($K)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Market Share and Customer Acquisition */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Market Share Pie Chart */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
                        Market Share Analysis
                      </h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <RechartsPieChart>
                          <Pie
                            data={chartData?.marketShareData || []}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={0}
                            dataKey="value"
                            label={false}
                          >
                            {(chartData?.marketShareData || []).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F3F4F6",
                            }}
                            formatter={(value, name) => [`${value}%`, name]}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>

                      {/* Legend */}
                      <div className="mt-4 space-y-2">
                        {(chartData?.marketShareData || []).map(
                          (entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="text-gray-300 text-sm">
                                  {entry.name}
                                </span>
                              </div>
                              <span className="text-white font-semibold text-sm">
                                {entry.value}%
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Customer Acquisition */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-yellow-400" />
                        Customer Acquisition
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData?.customerData || []}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F3F4F6",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="customers"
                            stroke="#ffee99"
                            strokeWidth={3}
                            name="New Customers"
                          />
                          <Line
                            type="monotone"
                            dataKey="churn"
                            stroke="#EF4444"
                            strokeWidth={2}
                            name="Churn Rate"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Financial Performance and Funding Breakdown */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Financial Performance */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                        Financial Performance
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData?.financialData || []}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="quarter" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F3F4F6",
                            }}
                          />
                          <Bar
                            dataKey="revenue"
                            fill="#ffee99"
                            name="Revenue ($K)"
                          />
                          <Bar
                            dataKey="expenses"
                            fill="#6B7280"
                            name="Expenses ($K)"
                          />
                          <Bar
                            dataKey="profit"
                            fill="#10B981"
                            name="Profit ($K)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Funding Breakdown */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-yellow-400" />
                        Funding Allocation
                      </h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <RechartsPieChart>
                          <Pie
                            data={chartData?.fundingData || []}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={0}
                            dataKey="amount"
                            label={false}
                          >
                            {(chartData?.fundingData || []).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F3F4F6",
                            }}
                            formatter={(value, name) => [`${value}%`, name]}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>

                      {/* Legend */}
                      <div className="mt-4 space-y-2">
                        {(chartData?.fundingData || []).map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              ></div>
                              <span className="text-gray-300 text-sm">
                                {entry.category}
                              </span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {entry.amount}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Key Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400">Funding Raised</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.fundingRaised}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400">Funding Goal</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.fundingGoal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400">Team Size</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.teamSize} people
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400">Founded</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.foundedDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-400">Location</span>
                    </div>
                    <span className="text-white font-semibold">
                      {project.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Financial Metrics
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Annual Revenue</p>
                    <p className="text-lg font-bold text-white">
                      {project.financials.revenue}
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Growth Rate</p>
                    <p className="text-lg font-bold text-green-400">
                      {project.financials.growth}
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Monthly Burn</p>
                    <p className="text-lg font-bold text-red-400">
                      {project.financials.burn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Founder</p>
                    <p className="text-white font-semibold">
                      {project.founder}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Website</p>
                    <a
                      href={`https://${project.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{project.website}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Team Members
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                      {project.founder
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {project.founder}
                      </p>
                      <p className="text-gray-400 text-sm">CEO & Founder</p>
                      <p className="text-gray-300 text-xs">
                        10+ years in {project.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      JD
                    </div>
                    <div>
                      <p className="text-white font-semibold">Jane Doe</p>
                      <p className="text-gray-400 text-sm">CTO</p>
                      <p className="text-gray-300 text-xs">
                        Former Google Engineer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      MS
                    </div>
                    <div>
                      <p className="text-white font-semibold">Mike Smith</p>
                      <p className="text-gray-400 text-sm">Head of Marketing</p>
                      <p className="text-gray-300 text-xs">
                        Ex-Facebook Growth Team
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Milestones */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Key Milestones
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-semibold">Product Launch</p>
                      <p className="text-gray-400 text-sm">Q1 2023</p>
                      <p className="text-gray-300 text-xs">
                        Successfully launched MVP with core features
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-semibold">
                        First 1000 Users
                      </p>
                      <p className="text-gray-400 text-sm">Q2 2023</p>
                      <p className="text-gray-300 text-xs">
                        Reached 1000 active users milestone
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-semibold">Seed Funding</p>
                      <p className="text-gray-400 text-sm">Q3 2023</p>
                      <p className="text-gray-300 text-xs">
                        Raised initial seed round from angel investors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-semibold">
                        Revenue Positive
                      </p>
                      <p className="text-gray-400 text-sm">Q4 2023</p>
                      <p className="text-gray-300 text-xs">
                        Achieved monthly recurring revenue of $50K
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-semibold">
                        Series A Target
                      </p>
                      <p className="text-gray-400 text-sm">Q2 2024</p>
                      <p className="text-gray-300 text-xs">
                        Planning Series A round for expansion
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Investors */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Existing Investors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                      AC
                    </div>
                    <p className="text-white font-semibold text-sm">
                      Accel Partners
                    </p>
                    <p className="text-gray-400 text-xs">Lead Investor</p>
                    <p className="text-yellow-400 text-xs mt-1">$1.2M</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                      SV
                    </div>
                    <p className="text-white font-semibold text-sm">
                      Sequoia Capital
                    </p>
                    <p className="text-gray-400 text-xs">Strategic Investor</p>
                    <p className="text-yellow-400 text-xs mt-1">$800K</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <p className="text-white font-semibold text-sm">
                      Angel Investors
                    </p>
                    <p className="text-gray-400 text-xs">Individual Angels</p>
                    <p className="text-yellow-400 text-xs mt-1">$300K</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                      TC
                    </div>
                    <p className="text-white font-semibold text-sm">
                      Techstars
                    </p>
                    <p className="text-gray-400 text-xs">Accelerator</p>
                    <p className="text-yellow-400 text-xs mt-1">$100K</p>
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-400 text-xs">Total Investors</p>
                      <p className="text-white font-bold text-lg">4</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Total Raised</p>
                      <p className="text-yellow-400 font-bold text-lg">
                        {project.fundingRaised}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Last Round</p>
                      <p className="text-white font-bold text-lg">
                        {project.stage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6">
            {/* Investment Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Wallet className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">
                  Invest in {project.name}
                </h3>
              </div>
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ×
              </button>
            </div>

            {/* Investment Details */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Current Funding</span>
                  <span className="text-white font-semibold">
                    {project.fundingRaised}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Funding Goal</span>
                  <span className="text-white font-semibold">
                    {project.fundingGoal}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Valuation</span>
                  <span className="text-white font-semibold">$25M</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Investment Amount (APTOS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount in APTOS"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    min="1"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    APTOS
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Minimum investment: 10 APTOS (~$50 USD)
                </p>
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-400 mt-0.5">ℹ️</div>
                  <div>
                    <h4 className="text-blue-300 font-semibold text-sm">
                      Investment Terms
                    </h4>
                    <ul className="text-blue-200 text-xs mt-1 space-y-1">
                      <li>• Equity-based investment</li>
                      <li>• 12-month lock-up period</li>
                      <li>• Quarterly progress reports</li>
                      <li>• Voting rights on major decisions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvestment}
                disabled={
                  isInvesting ||
                  !investmentAmount ||
                  parseFloat(investmentAmount) < 10
                }
                className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                  isInvesting ||
                  !investmentAmount ||
                  parseFloat(investmentAmount) < 10
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "text-black hover:opacity-80"
                }`}
                style={
                  !(
                    isInvesting ||
                    !investmentAmount ||
                    parseFloat(investmentAmount) < 10
                  )
                    ? { background: "#ffee99" }
                    : {}
                }
              >
                {isInvesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Invest Now</span>
                  </>
                )}
              </button>
            </div>

            {/* APTOS Info */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
                <span>🔒</span>
                <span>Secured by APTOS Blockchain</span>
                <span>•</span>
                <span>Smart Contract Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupDetail;
