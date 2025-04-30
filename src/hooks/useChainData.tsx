
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useWallet } from "@/providers/WalletProvider";
import { SuiClient } from '@mysten/sui.js/client';

// Define the document interface
export interface Document {
  id: string;
  key: string;
  content: string;
  lastModified: string;
}

// Define the store interface
export interface Store {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
}

export const useChainData = () => {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast: uiToast } = useToast();
  
  // Initialize Sui client
  const suiClient = new SuiClient({
    url: 'https://fullnode.testnet.sui.io:443'
  });

  // Create store with properly connected wallet
  const createStore = async (name: string) => {
    if (!isConnected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to create a store"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      // Show pending state for transaction
      const toastId = toast.loading("Creating store...", {
        description: "Transaction pending"
      });
      
      // In a real implementation, this would interact with the Sui blockchain
      // For now we'll simulate the transaction with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStore = {
        id: "store-" + Math.random().toString(36).substring(2, 9),
        name,
        owner: walletAddress || "unknown",
        createdAt: new Date().toISOString(),
      };
      setStore(newStore);
      
      // Update toast status
      toast.success("Store created", {
        id: toastId,
        description: `Store '${name}' has been created successfully`
      });
      
      return newStore;
    } catch (error) {
      toast.error("Store creation failed", {
        description: "Failed to create document store. Please try again."
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Add document with improved feedback
  const addDocument = async (key: string, content: string) => {
    if (!store) {
      toast.warning("No active store", {
        description: "Please create a store first"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      // Display transaction progress
      const toastId = toast.loading("Adding document...", {
        description: "Transaction pending"
      });
      
      // Simulating blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDoc = {
        id: "doc-" + Math.random().toString(36).substring(2, 9),
        key,
        content,
        lastModified: new Date().toISOString(),
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Update toast on success
      toast.success(`Document '${key}' added`, {
        id: toastId,
        description: "Document has been added to your store"
      });
      
      return newDoc;
    } catch (error) {
      toast.error("Failed to add document", {
        description: "An error occurred while adding the document"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update document implementation
  const updateDocument = async (id: string, content: string) => {
    if (!isConnected) return null;
    
    setIsLoading(true);
    try {
      const toastId = toast.loading("Updating document...");
      
      // Simulating transaction delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === id 
            ? { ...doc, content, lastModified: new Date().toISOString() } 
            : doc
        )
      );
      
      toast.success("Document updated", {
        id: toastId,
        description: "Changes have been saved"
      });
      
      return true;
    } catch (error) {
      toast.error("Update failed", {
        description: "Failed to update document. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete document implementation
  const deleteDocument = async (id: string) => {
    if (!isConnected) return false;
    
    setIsLoading(true);
    try {
      const toastId = toast.loading("Deleting document...");
      
      // Simulating transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      toast.success("Document deleted", {
        id: toastId,
      });
      
      return true;
    } catch (error) {
      toast.error("Deletion failed", {
        description: "Failed to delete document. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    store,
    documents,
    walletAddress,
    connectWallet,
    disconnectWallet,
    createStore,
    addDocument,
    updateDocument,
    deleteDocument,
    suiClient
  };
};
