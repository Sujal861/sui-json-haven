
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export interface ChainDataDocument {
  id: string;
  key: string;
  content: string;
  lastModified: string;
}

export interface ChainDataStore {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
}

export class ChainDataContract {
  private client: SuiClient;
  private moduleAddress: string;

  constructor(rpcUrl: string, moduleAddress: string) {
    this.client = new SuiClient({ url: rpcUrl });
    this.moduleAddress = moduleAddress;
  }

  async createStore(name: string, signer: any): Promise<ChainDataStore> {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${this.moduleAddress}::chain_data::create_store`,
      arguments: [tx.pure(name)],
    });

    try {
      const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      // Process and return the created store details
      return {
        id: result.objectId,
        name,
        owner: result.sender,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  }

  async addDocument(storeId: string, key: string, content: string, signer: any): Promise<ChainDataDocument> {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${this.moduleAddress}::chain_data::add_document`,
      arguments: [
        tx.pure(storeId),
        tx.pure(key),
        tx.pure(content),
      ],
    });

    try {
      const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      return {
        id: result.objectId,
        key,
        content,
        lastModified: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Additional methods for update, delete, and query operations will be implemented here
}

export const chainData = new ChainDataContract(
  'https://fullnode.testnet.sui.io:443',
  '0x0' // Replace with your deployed module address
);
