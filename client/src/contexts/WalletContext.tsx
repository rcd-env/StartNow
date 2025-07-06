import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface PetraWallet {
  connect: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  account: () => Promise<{ address: string }>;
  isConnected: () => Promise<boolean>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
}

declare global {
  interface Window {
    aptos?: PetraWallet;
    petra?: PetraWallet;
  }
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Check wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const wallet = window.aptos || window.petra;
        if (wallet) {
          const isConnected = await wallet.isConnected();
          if (isConnected) {
            const account = await wallet.account();
            setConnected(true);
            setAddress(account.address);
          }
        }
      } catch (error) {
        console.log('No existing wallet connection');
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const wallet = window.aptos || window.petra;
      if (!wallet) {
        throw new Error('Petra wallet not found');
      }

      const response = await wallet.connect();
      setConnected(true);
      setAddress(response.address);
      console.log('Connected to wallet:', response.address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      const wallet = window.aptos || window.petra;
      if (wallet) {
        await wallet.disconnect();
      }
      setConnected(false);
      setAddress(null);
      console.log('Disconnected from wallet');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const signAndSubmitTransaction = async (transaction: any) => {
    try {
      const wallet = window.aptos || window.petra;
      if (!wallet || !connected) {
        throw new Error('Wallet not connected');
      }

      const response = await wallet.signAndSubmitTransaction(transaction);
      return response;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const value: WalletContextType = {
    connected,
    address,
    connectWallet,
    disconnectWallet,
    signAndSubmitTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useCustomWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useCustomWallet must be used within a WalletProvider');
  }
  return context;
};
