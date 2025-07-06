import React, { useState } from 'react';
import { TrendingUp, Wallet, Lock } from 'lucide-react';
import InvestmentModal from './InvestmentModal';

interface Milestone {
  description: string;
  completed: boolean;
  completedAt: Date | null;
}

interface Startup {
  _id: string;
  name: string;
  description: string;
  blockchainPitchId?: number;
  escrowedAmount: number;
  releasedAmount: number;
  milestones: Milestone[];
  investors: Array<{
    wallet: string;
    amount: number;
    investedAt: Date;
  }>;
  isBlockchainEnabled: boolean;
}

interface InvestmentButtonProps {
  startup: Startup;
  walletAddress: string | null;
  onInvest: (startupId: string, amount: number) => Promise<void>;
  variant?: 'primary' | 'secondary' | 'card';
  size?: 'sm' | 'md' | 'lg';
}

const InvestmentButton: React.FC<InvestmentButtonProps> = ({
  startup,
  walletAddress,
  onInvest,
  variant = 'primary',
  size = 'md',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user already invested
  const hasInvested = walletAddress && startup.investors.some(inv => inv.wallet === walletAddress);
  
  // Check if startup has blockchain enabled
  const isBlockchainEnabled = startup.isBlockchainEnabled && startup.blockchainPitchId;

  const handleInvestClick = () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!isBlockchainEnabled) {
      alert('This startup has not enabled blockchain investments yet');
      return;
    }

    setIsModalOpen(true);
  };

  const handleInvest = async (amount: number) => {
    await onInvest(startup._id, amount);
    setIsModalOpen(false);
  };

  // Button styling based on variant and size
  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    // Size classes
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    // Variant classes
    let variantClasses = "";
    if (hasInvested) {
      variantClasses = "bg-green-100 text-green-800 border border-green-200 cursor-default";
    } else if (!isBlockchainEnabled) {
      variantClasses = "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed";
    } else if (!walletAddress) {
      variantClasses = "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200";
    } else {
      switch (variant) {
        case 'primary':
          variantClasses = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
          break;
        case 'secondary':
          variantClasses = "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500";
          break;
        case 'card':
          variantClasses = "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500";
          break;
      }
    }

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses}`;
  };

  const getButtonContent = () => {
    if (hasInvested) {
      const userInvestment = startup.investors.find(inv => inv.wallet === walletAddress);
      return (
        <>
          <Lock size={16} className="mr-2" />
          Invested {userInvestment?.amount} APT
        </>
      );
    }

    if (!isBlockchainEnabled) {
      return (
        <>
          <Lock size={16} className="mr-2" />
          Not Available
        </>
      );
    }

    if (!walletAddress) {
      return (
        <>
          <Wallet size={16} className="mr-2" />
          Connect Wallet to Invest
        </>
      );
    }

    return (
      <>
        <TrendingUp size={16} className="mr-2" />
        Invest in APT
      </>
    );
  };

  return (
    <>
      <button
        onClick={handleInvestClick}
        disabled={hasInvested || !isBlockchainEnabled}
        className={getButtonClasses()}
        title={
          hasInvested 
            ? "You have already invested in this startup"
            : !isBlockchainEnabled 
            ? "Blockchain investment not available for this startup"
            : !walletAddress
            ? "Connect your wallet to invest"
            : "Invest in this startup using Aptos"
        }
      >
        {getButtonContent()}
      </button>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startup={startup}
        walletAddress={walletAddress}
        onInvest={handleInvest}
      />
    </>
  );
};

export default InvestmentButton;
