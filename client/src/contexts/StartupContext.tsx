import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StartupProject {
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

interface StartupContextType {
  startupProjects: StartupProject[];
  addStartupProject: (project: StartupProject) => void;
  getStartupProject: (id: string) => StartupProject | undefined;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

export const useStartup = () => {
  const context = useContext(StartupContext);
  if (context === undefined) {
    throw new Error('useStartup must be used within a StartupProvider');
  }
  return context;
};

interface StartupProviderProps {
  children: ReactNode;
}

export const StartupProvider: React.FC<StartupProviderProps> = ({ children }) => {
  // Initial sample projects
  const [startupProjects, setStartupProjects] = useState<StartupProject[]>([
    {
      id: '1',
      name: 'EcoTech Solutions',
      description: 'Revolutionary AI-powered platform for sustainable energy management in smart cities.',
      industry: 'CleanTech',
      stage: 'Series A',
      fundingGoal: '$5M',
      fundingRaised: '$2.3M',
      foundedDate: '2022',
      location: 'San Francisco, CA',
      teamSize: 12,
      tags: ['AI', 'Sustainability', 'Smart Cities', 'IoT'],
      logo: '🌱',
      images: ['https://via.placeholder.com/800x400/1F2937/FFFFFF?text=EcoTech+Dashboard'],
      founder: 'Sarah Chen',
      website: 'www.ecotech-solutions.com',
      pitch: 'We help cities reduce energy consumption by 30% through AI-powered optimization of smart grid systems.',
      businessModel: 'SaaS subscription model with tiered pricing based on city size and energy consumption.',
      targetMarket: 'Municipal governments, utility companies, and smart city developers.',
      competition: 'Traditional energy management systems lack AI integration and real-time optimization.',
      traction: '5 pilot cities, 30% energy reduction achieved, $500K ARR',
      financials: {
        revenue: '$500K ARR',
        growth: '25% MoM',
        burn: '$150K/month'
      }
    },
    {
      id: '2',
      name: 'HealthLink AI',
      description: 'AI-driven telemedicine platform connecting patients with specialists worldwide.',
      industry: 'HealthTech',
      stage: 'Seed',
      fundingGoal: '$2M',
      fundingRaised: '$800K',
      foundedDate: '2023',
      location: 'Boston, MA',
      teamSize: 8,
      tags: ['AI', 'Healthcare', 'Telemedicine', 'Global Health'],
      logo: '🏥',
      images: ['https://via.placeholder.com/800x400/1F2937/FFFFFF?text=HealthLink+Platform'],
      founder: 'Dr. Michael Rodriguez',
      website: 'www.healthlink-ai.com',
      pitch: 'Breaking down geographical barriers in healthcare by connecting patients with the right specialists globally.',
      businessModel: 'Commission-based model on consultations plus subscription for healthcare providers.',
      targetMarket: 'Patients in underserved areas, healthcare providers, and medical specialists.',
      competition: 'Existing telemedicine platforms lack AI matching and global specialist networks.',
      traction: '1,000+ consultations, 50+ specialists, 95% patient satisfaction',
      financials: {
        revenue: '$120K ARR',
        growth: '40% MoM',
        burn: '$80K/month'
      }
    },
    {
      id: '3',
      name: 'EduVerse',
      description: 'Immersive VR/AR platform for interactive learning experiences in K-12 education.',
      industry: 'EdTech',
      stage: 'Pre-Seed',
      fundingGoal: '$1.5M',
      fundingRaised: '$300K',
      foundedDate: '2023',
      location: 'Austin, TX',
      teamSize: 6,
      tags: ['VR/AR', 'Education', 'K-12', 'Interactive Learning'],
      logo: '🎓',
      images: ['https://via.placeholder.com/800x400/1F2937/FFFFFF?text=EduVerse+VR'],
      founder: 'Lisa Park',
      website: 'www.eduverse-learning.com',
      pitch: 'Transforming education through immersive VR/AR experiences that make learning engaging and memorable.',
      businessModel: 'B2B SaaS model with schools and educational institutions.',
      targetMarket: 'K-12 schools, educational content creators, and homeschooling families.',
      competition: 'Traditional educational tools lack immersive experiences and engagement.',
      traction: '10 pilot schools, 500+ students engaged, 85% teacher approval',
      financials: {
        revenue: '$50K ARR',
        growth: '60% MoM',
        burn: '$45K/month'
      }
    },
    {
      id: '4',
      name: 'FinFlow',
      description: 'Blockchain-based cross-border payment solution for small businesses.',
      industry: 'FinTech',
      stage: 'Series A',
      fundingGoal: '$8M',
      fundingRaised: '$4.2M',
      foundedDate: '2021',
      location: 'New York, NY',
      teamSize: 18,
      tags: ['Blockchain', 'Payments', 'Cross-border', 'SMB'],
      logo: '💰',
      images: ['https://via.placeholder.com/800x400/1F2937/FFFFFF?text=FinFlow+Dashboard'],
      founder: 'Alex Thompson',
      website: 'www.finflow-payments.com',
      pitch: 'Enabling small businesses to send and receive international payments 10x faster and 50% cheaper.',
      businessModel: 'Transaction fees and premium features for business accounts.',
      targetMarket: 'Small to medium businesses engaged in international trade.',
      competition: 'Traditional banks and payment processors are slow and expensive for cross-border transactions.',
      traction: '2,000+ business customers, $10M+ transaction volume, 15+ countries',
      financials: {
        revenue: '$1.2M ARR',
        growth: '20% MoM',
        burn: '$200K/month'
      }
    },
    {
      id: '5',
      name: 'AgriSmart',
      description: 'IoT and AI-powered precision agriculture platform for sustainable farming.',
      industry: 'AgTech',
      stage: 'Seed',
      fundingGoal: '$3M',
      fundingRaised: '$1.1M',
      foundedDate: '2022',
      location: 'Denver, CO',
      teamSize: 10,
      tags: ['IoT', 'AI', 'Agriculture', 'Sustainability'],
      logo: '🌾',
      images: ['https://via.placeholder.com/800x400/1F2937/FFFFFF?text=AgriSmart+Sensors'],
      founder: 'Maria Gonzalez',
      website: 'www.agrismart-tech.com',
      pitch: 'Helping farmers increase crop yields by 25% while reducing water usage by 40% through smart farming.',
      businessModel: 'Hardware sales plus SaaS subscription for data analytics and insights.',
      targetMarket: 'Commercial farmers, agricultural cooperatives, and agribusiness companies.',
      competition: 'Traditional farming methods lack data-driven insights and optimization.',
      traction: '100+ farms, 10,000+ acres monitored, 25% average yield increase',
      financials: {
        revenue: '$300K ARR',
        growth: '35% MoM',
        burn: '$90K/month'
      }
    },
    {
      id: '6',
      name: 'RetailBot',
      description: 'AI-powered customer service chatbot specifically designed for e-commerce.',
      industry: 'E-commerce',
      stage: 'Pre-Seed',
      fundingGoal: '$1M',
      fundingRaised: '$250K',
      foundedDate: '2023',
      location: 'Seattle, WA',
      teamSize: 5,
      tags: ['AI', 'Chatbot', 'E-commerce', 'Customer Service'],
      logo: '🤖',
      images: ['https://via.placeholder.com/800x400/1F2937/FFFFFF?text=RetailBot+Interface'],
      founder: 'David Kim',
      website: 'www.retailbot-ai.com',
      pitch: 'Reducing customer service costs by 60% while improving response times and customer satisfaction.',
      businessModel: 'Monthly subscription based on number of conversations and integrations.',
      targetMarket: 'E-commerce businesses, online retailers, and marketplace sellers.',
      competition: 'Generic chatbots lack e-commerce specific features and integrations.',
      traction: '50+ e-commerce clients, 100K+ conversations handled, 90% resolution rate',
      financials: {
        revenue: '$75K ARR',
        growth: '50% MoM',
        burn: '$35K/month'
      }
    }
  ]);

  const addStartupProject = (project: StartupProject) => {
    setStartupProjects(prev => [project, ...prev]);
  };

  const getStartupProject = (id: string): StartupProject | undefined => {
    return startupProjects.find(project => project.id === id);
  };

  const value = {
    startupProjects,
    addStartupProject,
    getStartupProject
  };

  return (
    <StartupContext.Provider value={value}>
      {children}
    </StartupContext.Provider>
  );
};

export default StartupProvider;
