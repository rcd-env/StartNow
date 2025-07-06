import React, { createContext, useContext, useState, useCallback } from 'react';
import aptosService from '../services/aptosService';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface InvestmentContextType {
  // Investment operations
  createBlockchainPitch: (startupId: string, milestones: string[]) => Promise<void>;
  investInStartup: (startupId: string, amount: number) => Promise<void>;
  completeMilestone: (startupId: string, milestoneIndex: number) => Promise<void>;
  releaseFunds: (startupId: string) => Promise<void>;
  requestRefund: (startupId: string) => Promise<void>;
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Utility functions
  clearError: () => void;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

interface InvestmentProviderProps {
  children: React.ReactNode;
}

export const InvestmentProvider: React.FC<InvestmentProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account, signAndSubmitTransaction } = useWallet();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // API call helper
  const apiCall = async (url: string, method: string, data?: any) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  };

  const createBlockchainPitch = useCallback(async (startupId: string, milestones: string[]) => {
    if (!account) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, create the pitch on the blockchain
      const transactionHash = await aptosService.createPitch(
        account,
        'Startup Pitch', // This would come from startup data
        'Startup Description', // This would come from startup data
        milestones
      );

      // Get the pitch ID from transaction events (simplified for now)
      const pitchId = Date.now(); // In reality, you'd parse this from transaction events

      // Then update the backend database
      await apiCall('/investments/blockchain/pitch', 'POST', {
        startupId,
        milestones,
        transactionHash,
        pitchId,
        founderWallet: account.address,
      });

      console.log('Blockchain pitch created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create blockchain pitch');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const investInStartup = useCallback(async (startupId: string, amount: number) => {
    if (!account) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert APT to Octas for blockchain transaction
      const amountInOctas = aptosService.aptToOctas(amount);
      
      // Get the startup's blockchain pitch ID from backend
      const startupResponse = await apiCall(`/investments/blockchain/pitch/${startupId}`, 'GET');
      const pitchId = startupResponse.data.startup.blockchainPitchId;

      if (!pitchId) {
        throw new Error('This startup has not enabled blockchain investments');
      }

      // Execute blockchain investment
      const transactionHash = await aptosService.invest(account, pitchId, amountInOctas);

      // Update backend database
      await apiCall('/investments/blockchain/invest', 'POST', {
        startupId,
        pitchId,
        amount,
        walletAddress: account.address,
        transactionHash,
      });

      console.log('Investment successful');
    } catch (err: any) {
      setError(err.message || 'Investment failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const completeMilestone = useCallback(async (startupId: string, milestoneIndex: number) => {
    if (!account) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the startup's blockchain pitch ID
      const startupResponse = await apiCall(`/investments/blockchain/pitch/${startupId}`, 'GET');
      const pitchId = startupResponse.data.startup.blockchainPitchId;

      if (!pitchId) {
        throw new Error('This startup has not enabled blockchain investments');
      }

      // Execute blockchain milestone completion
      const transactionHash = await aptosService.completeMilestone(account, pitchId, milestoneIndex);

      // Update backend database
      await apiCall('/investments/blockchain/milestone/complete', 'POST', {
        startupId,
        pitchId,
        milestoneIndex,
        transactionHash,
        founderWallet: account.address,
      });

      console.log('Milestone completed successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to complete milestone');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const releaseFunds = useCallback(async (startupId: string) => {
    if (!account) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the startup's blockchain pitch ID
      const startupResponse = await apiCall(`/investments/blockchain/pitch/${startupId}`, 'GET');
      const pitchId = startupResponse.data.startup.blockchainPitchId;

      if (!pitchId) {
        throw new Error('This startup has not enabled blockchain investments');
      }

      // Execute blockchain fund release
      const transactionHash = await aptosService.releaseFunds(account, pitchId);

      // Calculate released amount (this would be parsed from transaction events in reality)
      const startup = startupResponse.data.startup;
      const completedMilestones = startup.milestones.filter((m: any) => m.completed).length;
      const totalMilestones = startup.milestones.length;
      const totalReleasable = (startup.escrowedAmount * completedMilestones) / totalMilestones;
      const amount = totalReleasable - startup.releasedAmount;

      // Update backend database
      await apiCall('/investments/blockchain/funds/release', 'POST', {
        startupId,
        pitchId,
        amount,
        transactionHash,
        founderWallet: account.address,
      });

      console.log('Funds released successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to release funds');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const requestRefund = useCallback(async (startupId: string) => {
    if (!account) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the startup's blockchain pitch ID
      const startupResponse = await apiCall(`/investments/blockchain/pitch/${startupId}`, 'GET');
      const pitchId = startupResponse.data.startup.blockchainPitchId;

      if (!pitchId) {
        throw new Error('This startup has not enabled blockchain investments');
      }

      // Execute blockchain refund request
      const transactionHash = await aptosService.requestRefund(account, pitchId);

      // Find user's investment amount
      const startup = startupResponse.data.startup;
      const userInvestment = startup.investors.find((inv: any) => inv.wallet === account.address);
      
      if (!userInvestment) {
        throw new Error('No investment found for this wallet');
      }

      // Update backend database
      await apiCall('/investments/blockchain/refund', 'POST', {
        startupId,
        pitchId,
        amount: userInvestment.amount,
        walletAddress: account.address,
        transactionHash,
      });

      console.log('Refund processed successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to process refund');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const value: InvestmentContextType = {
    createBlockchainPitch,
    investInStartup,
    completeMilestone,
    releaseFunds,
    requestRefund,
    isLoading,
    error,
    clearError,
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};
