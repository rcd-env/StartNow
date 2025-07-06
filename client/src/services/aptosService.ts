import { 
  Aptos, 
  AptosConfig, 
  Network,
  Account,
  Ed25519PrivateKey,
  AccountAddress,
  MoveString,
  MoveVector,
  U64,
  InputTransactionData,
} from '@aptos-labs/ts-sdk';

// Types for our smart contract
export interface Milestone {
  description: string;
  completed: boolean;
  completed_at: number;
}

export interface Investment {
  investor: string;
  amount: number;
  invested_at: number;
}

export interface PitchData {
  id: number;
  founder: string;
  title: string;
  description: string;
  milestones: Milestone[];
  total_escrowed: number;
  total_released: number;
  investments: Investment[];
  created_at: number;
  active: boolean;
}

class AptosService {
  private aptos: Aptos;
  private moduleAddress: string;

  constructor() {
    // Initialize Aptos client for testnet
    const config = new AptosConfig({ 
      network: Network.TESTNET 
    });
    this.aptos = new Aptos(config);
    
    // This will be set when contract is deployed
    this.moduleAddress = "0x1"; // Placeholder - will be updated after deployment
  }

  // Set the deployed contract address
  setModuleAddress(address: string) {
    this.moduleAddress = address;
  }

  // Create a new pitch with milestones
  async createPitch(
    account: any, // Wallet account
    title: string,
    description: string,
    milestoneDescriptions: string[]
  ): Promise<string> {
    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::pitch_funding::create_pitch`,
          functionArguments: [
            new MoveString(title),
            new MoveString(description),
            new MoveVector(milestoneDescriptions.map(desc => new MoveString(desc))),
          ],
        },
      };

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error creating pitch:', error);
      throw new Error('Failed to create pitch on blockchain');
    }
  }

  // Invest in a pitch
  async invest(
    account: any, // Wallet account
    pitchId: number,
    amount: number // Amount in Octas (1 APT = 100,000,000 Octas)
  ): Promise<string> {
    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::pitch_funding::invest`,
          functionArguments: [
            new U64(pitchId),
            new U64(amount),
          ],
        },
      };

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error investing:', error);
      throw new Error('Failed to invest in pitch');
    }
  }

  // Complete a milestone
  async completeMilestone(
    account: any, // Wallet account
    pitchId: number,
    milestoneIndex: number
  ): Promise<string> {
    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::pitch_funding::complete_milestone`,
          functionArguments: [
            new U64(pitchId),
            new U64(milestoneIndex),
          ],
        },
      };

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error completing milestone:', error);
      throw new Error('Failed to complete milestone');
    }
  }

  // Release funds to founder
  async releaseFunds(
    account: any, // Wallet account
    pitchId: number
  ): Promise<string> {
    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::pitch_funding::release_funds`,
          functionArguments: [
            new U64(pitchId),
          ],
        },
      };

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error releasing funds:', error);
      throw new Error('Failed to release funds');
    }
  }

  // Request refund
  async requestRefund(
    account: any, // Wallet account
    pitchId: number
  ): Promise<string> {
    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::pitch_funding::refund_investor`,
          functionArguments: [
            new U64(pitchId),
          ],
        },
      };

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw new Error('Failed to request refund');
    }
  }

  // View functions to get pitch data
  async getPitch(pitchId: number): Promise<any> {
    try {
      const result = await this.aptos.view({
        payload: {
          function: `${this.moduleAddress}::pitch_funding::get_pitch`,
          functionArguments: [new U64(pitchId)],
        },
      });

      return result;
    } catch (error) {
      console.error('Error getting pitch:', error);
      throw new Error('Failed to get pitch data');
    }
  }

  async getMilestones(pitchId: number): Promise<Milestone[]> {
    try {
      const result = await this.aptos.view({
        payload: {
          function: `${this.moduleAddress}::pitch_funding::get_milestones`,
          functionArguments: [new U64(pitchId)],
        },
      });

      return result as Milestone[];
    } catch (error) {
      console.error('Error getting milestones:', error);
      throw new Error('Failed to get milestones');
    }
  }

  async getInvestments(pitchId: number): Promise<Investment[]> {
    try {
      const result = await this.aptos.view({
        payload: {
          function: `${this.moduleAddress}::pitch_funding::get_investments`,
          functionArguments: [new U64(pitchId)],
        },
      });

      return result as Investment[];
    } catch (error) {
      console.error('Error getting investments:', error);
      throw new Error('Failed to get investments');
    }
  }

  // Utility functions
  aptToOctas(apt: number): number {
    return Math.floor(apt * 100_000_000); // 1 APT = 100,000,000 Octas
  }

  octasToApt(octas: number): number {
    return octas / 100_000_000;
  }

  // Get account balance
  async getAccountBalance(accountAddress: string): Promise<number> {
    try {
      const resources = await this.aptos.getAccountResources({
        accountAddress: AccountAddress.from(accountAddress),
      });

      const coinResource = resources.find(
        (resource) => resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );

      if (coinResource) {
        const balance = (coinResource.data as any).coin.value;
        return this.octasToApt(parseInt(balance));
      }

      return 0;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  // Check if account exists
  async accountExists(accountAddress: string): Promise<boolean> {
    try {
      await this.aptos.getAccountInfo({
        accountAddress: AccountAddress.from(accountAddress),
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const aptosService = new AptosService();
export default aptosService;
