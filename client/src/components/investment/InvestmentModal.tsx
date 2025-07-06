import React, { useState, useEffect } from 'react';
import { X, Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

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

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  startup: Startup;
  walletAddress: string | null;
  onInvest: (amount: number) => Promise<void>;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  startup,
  walletAddress,
  onInvest,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
      setStep('input');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 8 decimal places (APT precision)
    if (value === '' || /^\d*\.?\d{0,8}$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleInvest = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }

    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    // Check if user already invested
    const hasInvested = startup.investors.some(inv => inv.wallet === walletAddress);
    if (hasInvested) {
      setError('You have already invested in this startup');
      return;
    }

    setIsLoading(true);
    setStep('processing');
    setError('');

    try {
      await onInvest(parseFloat(amount));
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Investment failed. Please try again.');
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Invest in {startup.name}</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'input' && (
            <>
              {/* Startup Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">About this Investment</h3>
                <p className="text-gray-600 text-sm mb-4">{startup.description}</p>
                
                {/* Investment Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Total Escrowed</div>
                    <div className="font-semibold">{startup.escrowedAmount} APT</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Investors</div>
                    <div className="font-semibold">{startup.investors.length}</div>
                  </div>
                </div>

                {/* Milestones Preview */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Milestones ({startup.milestones.filter(m => m.completed).length}/{startup.milestones.length} completed)</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {startup.milestones.slice(0, 3).map((milestone, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {milestone.completed && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={milestone.completed ? 'text-green-600' : 'text-gray-600'}>
                          {milestone.description}
                        </span>
                      </div>
                    ))}
                    {startup.milestones.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{startup.milestones.length - 3} more milestones
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Investment Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (APT)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-3 text-gray-500">
                    <Wallet size={20} />
                  </div>
                </div>
                {error && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {error}
                  </div>
                )}
              </div>

              {/* Investment Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your funds are held in a secure smart contract</li>
                  <li>• Funds are released only when milestones are completed</li>
                  <li>• You can request a refund if progress stalls</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvest}
                  disabled={!amount || parseFloat(amount) <= 0 || !walletAddress}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Invest {amount} APT
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Investment</h3>
              <p className="text-gray-600">Please confirm the transaction in your wallet...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Successful!</h3>
              <p className="text-gray-600 mb-6">
                You have successfully invested {amount} APT in {startup.name}
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
