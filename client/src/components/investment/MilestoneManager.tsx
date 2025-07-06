import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, TrendingUp, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';

interface Milestone {
  description: string;
  completed: boolean;
  completedAt: Date | null;
}

interface Investor {
  wallet: string;
  amount: number;
  investedAt: Date;
}

interface Startup {
  _id: string;
  name: string;
  description: string;
  blockchainPitchId?: number;
  escrowedAmount: number;
  releasedAmount: number;
  milestones: Milestone[];
  investors: Investor[];
  isBlockchainEnabled: boolean;
}

interface MilestoneManagerProps {
  startup: Startup;
  walletAddress: string | null;
  isFounder: boolean;
  onCompleteMilestone: (startupId: string, milestoneIndex: number) => Promise<void>;
  onReleaseFunds: (startupId: string) => Promise<void>;
}

const MilestoneManager: React.FC<MilestoneManagerProps> = ({
  startup,
  walletAddress,
  isFounder,
  onCompleteMilestone,
  onReleaseFunds,
}) => {
  const [loadingMilestone, setLoadingMilestone] = useState<number | null>(null);
  const [loadingRelease, setLoadingRelease] = useState(false);
  const [error, setError] = useState<string>('');

  const completedMilestones = startup.milestones.filter(m => m.completed).length;
  const totalMilestones = startup.milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  // Calculate releasable funds
  const totalReleasable = totalMilestones > 0 ? 
    (startup.escrowedAmount * completedMilestones) / totalMilestones : 0;
  const pendingRelease = totalReleasable - startup.releasedAmount;

  const handleCompleteMilestone = async (milestoneIndex: number) => {
    if (!isFounder || !walletAddress) {
      setError('Only the founder can complete milestones');
      return;
    }

    setLoadingMilestone(milestoneIndex);
    setError('');

    try {
      await onCompleteMilestone(startup._id, milestoneIndex);
    } catch (err: any) {
      setError(err.message || 'Failed to complete milestone');
    } finally {
      setLoadingMilestone(null);
    }
  };

  const handleReleaseFunds = async () => {
    if (!isFounder || !walletAddress) {
      setError('Only the founder can release funds');
      return;
    }

    if (pendingRelease <= 0) {
      setError('No funds available for release');
      return;
    }

    setLoadingRelease(true);
    setError('');

    try {
      await onReleaseFunds(startup._id);
    } catch (err: any) {
      setError(err.message || 'Failed to release funds');
    } finally {
      setLoadingRelease(false);
    }
  };

  if (!startup.isBlockchainEnabled) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Not Enabled</h3>
          <p className="text-gray-600">This startup has not enabled blockchain investments yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Investment Overview */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign size={20} className="text-blue-600 mr-2" />
              <div>
                <div className="text-sm text-blue-600">Total Escrowed</div>
                <div className="text-xl font-bold text-blue-900">{startup.escrowedAmount} APT</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp size={20} className="text-green-600 mr-2" />
              <div>
                <div className="text-sm text-green-600">Released</div>
                <div className="text-xl font-bold text-green-900">{startup.releasedAmount} APT</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users size={20} className="text-purple-600 mr-2" />
              <div>
                <div className="text-sm text-purple-600">Investors</div>
                <div className="text-xl font-bold text-purple-900">{startup.investors.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Milestone Progress</span>
            <span>{completedMilestones}/{totalMilestones} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Release Funds Button */}
        {isFounder && pendingRelease > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">Funds Ready for Release</h4>
                <p className="text-sm text-green-700">{pendingRelease.toFixed(2)} APT available</p>
              </div>
              <button
                onClick={handleReleaseFunds}
                disabled={loadingRelease}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {loadingRelease ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                  <DollarSign size={16} className="mr-2" />
                )}
                Release Funds
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {startup.milestones.map((milestone, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 ${
                milestone.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full mr-3 mt-0.5 flex items-center justify-center ${
                    milestone.completed 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}>
                    {milestone.completed ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <Clock size={16} className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      milestone.completed ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      Milestone {index + 1}
                    </h4>
                    <p className={`text-sm ${
                      milestone.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {milestone.description}
                    </p>
                    {milestone.completed && milestone.completedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Complete Milestone Button */}
                {isFounder && !milestone.completed && (
                  <button
                    onClick={() => handleCompleteMilestone(index)}
                    disabled={loadingMilestone === index}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {loadingMilestone === index ? (
                      <Loader2 size={14} className="animate-spin mr-1" />
                    ) : (
                      <CheckCircle size={14} className="mr-1" />
                    )}
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {startup.milestones.length === 0 && (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Milestones Set</h4>
            <p className="text-gray-600">This startup hasn't defined any milestones yet.</p>
          </div>
        )}
      </div>

      {/* Investors List */}
      {startup.investors.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investors</h3>
          <div className="space-y-3">
            {startup.investors.map((investor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-mono text-sm text-gray-900">
                    {investor.wallet.slice(0, 6)}...{investor.wallet.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Invested on {new Date(investor.investedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{investor.amount} APT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneManager;
