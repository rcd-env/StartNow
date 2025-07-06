import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Milestone {
  description: string;
  completed: boolean;
  completedAt: Date | null;
}

export interface Investor {
  wallet: string;
  amount: number;
  investedAt: Date;
}

export interface StartupProject {
  id: string;
  _id?: string; // MongoDB ID
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
  // Blockchain fields
  blockchainPitchId?: number;
  escrowedAmount: number;
  releasedAmount: number;
  milestones: Milestone[];
  investors: Investor[];
  isBlockchainEnabled: boolean;
}

interface StartupContextType {
  startupProjects: StartupProject[];
  loading: boolean;
  error: string | null;
  addStartupProject: (project: StartupProject) => void;
  getStartupProject: (id: string) => StartupProject | undefined;
  fetchStartups: () => Promise<void>;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

export const useStartup = () => {
  const context = useContext(StartupContext);
  if (context === undefined) {
    throw new Error("useStartup must be used within a StartupProvider");
  }
  return context;
};

interface StartupProviderProps {
  children: ReactNode;
}

export const StartupProvider: React.FC<StartupProviderProps> = ({
  children,
}) => {
  const [startupProjects, setStartupProjects] = useState<StartupProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data fallback
  const getSampleData = (): StartupProject[] => [
    {
      id: "1",
      name: "EcoTech Solutions",
      description:
        "Revolutionary AI-powered platform for sustainable energy management in smart cities.",
      industry: "CleanTech",
      stage: "Series A",
      fundingGoal: "$5M",
      fundingRaised: "$2.3M",
      foundedDate: "2022",
      location: "San Francisco, CA",
      teamSize: 12,
      tags: ["AI", "Sustainability", "Smart Cities", "IoT"],
      logo: "🌱",
      images: [
        "https://images.unsplash.com/photo-1497436072909-f5e4be1713a0?w=800&h=400&fit=crop",
      ],
      founder: "Sarah Chen",
      website: "www.ecotech-solutions.com",
      pitch:
        "Reducing urban energy consumption by 30% through intelligent grid management and predictive analytics.",
      businessModel:
        "SaaS subscription model with tiered pricing based on city size and energy consumption.",
      targetMarket:
        "Smart cities, municipal governments, and large commercial real estate developers.",
      competition:
        "Traditional energy management systems lack AI capabilities and real-time optimization.",
      traction: "Deployed in 5 cities, 40% average energy savings, $2.3M ARR",
      financials: {
        revenue: "$2.3M ARR",
        growth: "25% MoM",
        burn: "$180K/month",
      },
      // Blockchain fields
      blockchainPitchId: 1,
      escrowedAmount: 50, // 50 APT
      releasedAmount: 15, // 15 APT released
      milestones: [
        {
          description: "MVP Development",
          completed: true,
          completedAt: new Date("2024-01-15"),
        },
        {
          description: "First City Deployment",
          completed: true,
          completedAt: new Date("2024-03-20"),
        },
        { description: "5 City Rollout", completed: false, completedAt: null },
        {
          description: "Series A Funding",
          completed: false,
          completedAt: null,
        },
      ],
      investors: [
        {
          wallet: "0x1234...5678",
          amount: 25,
          investedAt: new Date("2024-01-10"),
        },
        {
          wallet: "0x9abc...def0",
          amount: 25,
          investedAt: new Date("2024-02-15"),
        },
      ],
      isBlockchainEnabled: true,
    },
    {
      id: "2",
      name: "HealthLink AI",
      description:
        "AI-driven telemedicine platform connecting patients with specialists worldwide.",
      industry: "HealthTech",
      stage: "Seed",
      fundingGoal: "$2M",
      fundingRaised: "$800K",
      foundedDate: "2023",
      location: "Boston, MA",
      teamSize: 8,
      tags: ["AI", "Healthcare", "Telemedicine", "Global Health"],
      logo: "🏥",
      images: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      ],
      founder: "Dr. Michael Rodriguez",
      website: "www.healthlink-ai.com",
      pitch:
        "Breaking down geographical barriers in healthcare by connecting patients with the right specialists globally.",
      businessModel:
        "Commission-based model on consultations plus subscription for healthcare providers.",
      targetMarket:
        "Patients in underserved areas, healthcare providers, and international medical tourism.",
      competition:
        "Existing telemedicine platforms lack AI matching and global specialist networks.",
      traction:
        "10K+ consultations, 95% patient satisfaction, partnerships with 500+ specialists",
      financials: {
        revenue: "$400K ARR",
        growth: "40% MoM",
        burn: "$120K/month",
      },
      // Blockchain fields
      blockchainPitchId: 2,
      escrowedAmount: 30, // 30 APT
      releasedAmount: 0, // No funds released yet
      milestones: [
        {
          description: "Platform Beta Launch",
          completed: true,
          completedAt: new Date("2024-02-01"),
        },
        {
          description: "1000 Active Users",
          completed: false,
          completedAt: null,
        },
        {
          description: "Healthcare Partnership",
          completed: false,
          completedAt: null,
        },
        {
          description: "Regulatory Approval",
          completed: false,
          completedAt: null,
        },
      ],
      investors: [
        {
          wallet: "0xabcd...1234",
          amount: 20,
          investedAt: new Date("2024-01-20"),
        },
        {
          wallet: "0xef56...7890",
          amount: 10,
          investedAt: new Date("2024-02-10"),
        },
      ],
      isBlockchainEnabled: true,
    },
    {
      id: "3",
      name: "DeFi Bridge",
      description:
        "Cross-chain DeFi protocol enabling seamless asset transfers between blockchains.",
      industry: "FinTech",
      stage: "Pre-Seed",
      fundingGoal: "$1.5M",
      fundingRaised: "$300K",
      foundedDate: "2023",
      location: "New York, NY",
      teamSize: 6,
      tags: ["DeFi", "Blockchain", "Cross-chain", "Web3"],
      logo: "🌉",
      images: [
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      ],
      founder: "Alex Thompson",
      website: "www.defi-bridge.com",
      pitch:
        "Solving blockchain interoperability with secure, fast, and low-cost cross-chain transactions.",
      businessModel:
        "Transaction fees on cross-chain transfers and premium features for institutional users.",
      targetMarket:
        "DeFi users, institutional investors, and blockchain developers.",
      competition:
        "Current bridges are slow, expensive, and have security vulnerabilities.",
      traction: "$50M+ in cross-chain volume, 5K+ active users, 99.9% uptime",
      financials: {
        revenue: "$150K ARR",
        growth: "60% MoM",
        burn: "$80K/month",
      },
      // Blockchain fields
      blockchainPitchId: 3,
      escrowedAmount: 75, // 75 APT
      releasedAmount: 25, // 25 APT released
      milestones: [
        {
          description: "Protocol Development",
          completed: true,
          completedAt: new Date("2024-01-01"),
        },
        {
          description: "Security Audit",
          completed: true,
          completedAt: new Date("2024-02-15"),
        },
        {
          description: "Mainnet Launch",
          completed: true,
          completedAt: new Date("2024-03-01"),
        },
        { description: "$100M Volume", completed: false, completedAt: null },
      ],
      investors: [
        {
          wallet: "0x5678...9abc",
          amount: 40,
          investedAt: new Date("2023-12-15"),
        },
        {
          wallet: "0xdef0...1234",
          amount: 35,
          investedAt: new Date("2024-01-05"),
        },
      ],
      isBlockchainEnabled: true,
    },
    {
      id: "4",
      name: "EduTech Pro",
      description:
        "Personalized learning platform using AI to adapt to individual student needs.",
      industry: "EdTech",
      stage: "Seed",
      fundingGoal: "$3M",
      fundingRaised: "$1.2M",
      foundedDate: "2022",
      location: "Austin, TX",
      teamSize: 15,
      tags: ["AI", "Education", "Personalization", "Learning"],
      logo: "📚",
      images: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      ],
      founder: "Jennifer Kim",
      website: "www.edutech-pro.com",
      pitch:
        "Improving learning outcomes by 40% through AI-powered personalized education paths.",
      businessModel:
        "B2B SaaS for schools and B2C subscription for individual learners.",
      targetMarket:
        "K-12 schools, universities, and individual students seeking personalized learning.",
      competition:
        "Traditional LMS platforms lack personalization and adaptive learning capabilities.",
      traction: "200+ schools, 50K+ students, 40% improvement in test scores",
      financials: {
        revenue: "$800K ARR",
        growth: "35% MoM",
        burn: "$150K/month",
      },
      // Blockchain fields - not yet enabled
      escrowedAmount: 0,
      releasedAmount: 0,
      milestones: [],
      investors: [],
      isBlockchainEnabled: false,
    },
    {
      id: "6",
      name: "RetailBot AI",
      description:
        "AI-powered chatbot platform specifically designed for e-commerce customer service.",
      industry: "E-commerce",
      stage: "Pre-Seed",
      fundingGoal: "$1M",
      fundingRaised: "$250K",
      foundedDate: "2023",
      location: "Seattle, WA",
      teamSize: 5,
      tags: ["AI", "E-commerce", "Customer Service", "Automation"],
      logo: "🤖",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      ],
      founder: "David Park",
      website: "www.retailbot-ai.com",
      pitch:
        "Reducing customer service costs by 60% while improving response times and satisfaction.",
      businessModel:
        "Monthly SaaS subscription based on number of conversations handled.",
      targetMarket:
        "E-commerce businesses, online retailers, and marketplace sellers.",
      competition:
        "Generic chatbots lack e-commerce specific features and integrations.",
      traction:
        "50+ e-commerce clients, 100K+ conversations handled, 90% resolution rate",
      financials: {
        revenue: "$75K ARR",
        growth: "50% MoM",
        burn: "$35K/month",
      },
      // Blockchain fields - not yet enabled
      escrowedAmount: 0,
      releasedAmount: 0,
      milestones: [],
      investors: [],
      isBlockchainEnabled: false,
    },
  ];

  // Fetch startups from API
  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(
        `https://startnow-9c9x.onrender.com/api/startups`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch startups: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.startups) {
        // Transform backend data to match frontend interface
        const transformedStartups: StartupProject[] = data.data.startups.map(
          (startup: any) => ({
            id: startup._id,
            name: startup.name,
            description: startup.description,
            industry: startup.industry,
            stage: startup.stage,
            fundingGoal: startup.fundingGoal,
            fundingRaised: startup.fundingRaised || "$0",
            foundedDate: startup.foundedDate,
            location: startup.location,
            teamSize: startup.teamSize,
            tags: startup.tags || [],
            logo: startup.logo || "🚀",
            images: startup.images || [],
            founder: startup.founder?.name || "Unknown",
            website: startup.website || "",
            pitch: startup.pitch,
            businessModel: startup.businessModel,
            targetMarket: startup.targetMarket,
            competition: startup.competition,
            traction: startup.traction,
            financials: startup.financials || {
              revenue: "N/A",
              growth: "N/A",
              burn: "N/A",
            },
            // Blockchain fields
            _id: startup._id,
            blockchainPitchId: startup.blockchainPitchId,
            escrowedAmount: startup.escrowedAmount || 0,
            releasedAmount: startup.releasedAmount || 0,
            milestones: startup.milestones || [],
            investors: startup.investors || [],
            isBlockchainEnabled: startup.isBlockchainEnabled || false,
          })
        );

        setStartupProjects(transformedStartups);
      } else {
        // Fallback to sample data if API fails
        setStartupProjects(getSampleData());
      }
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch startups");
      // Fallback to sample data on error
      setStartupProjects(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStartups();
  }, []);

  const addStartupProject = (project: StartupProject) => {
    setStartupProjects((prev) => [project, ...prev]);
  };

  const getStartupProject = (id: string): StartupProject | undefined => {
    return startupProjects.find((project) => project.id === id);
  };

  const value = {
    startupProjects,
    loading,
    error,
    addStartupProject,
    getStartupProject,
    fetchStartups,
  };

  return (
    <StartupContext.Provider value={value}>{children}</StartupContext.Provider>
  );
};

export default StartupProvider;
