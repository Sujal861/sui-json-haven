
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  manualConnectWallet: (address: string) => void;
  isManualConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isManualConnected, setIsManualConnected] = useState<boolean>(false);
  
  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if window.sui is available (Sui wallet extension)
        if (typeof window !== 'undefined' && 'suiWallet' in window) {
          const wallet = (window as any).suiWallet;
          const accounts = await wallet.getAccounts();
          
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            setIsManualConnected(false);
            toast.success("Wallet already connected", {
              description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
            });
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkWalletConnection();
  }, []);

  const connectWallet = async (): Promise<string | null> => {
    try {
      // Check if Sui wallet extension is installed
      if (typeof window === 'undefined' || !('suiWallet' in window)) {
        toast.error("Sui Wallet not found", {
          description: "Please install Sui Wallet extension first"
        });
        
        // Open Sui wallet installation page in a new tab
        window.open(
          "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
          "_blank"
        );
        
        return null;
      }
      
      // Request connection to wallet
      const wallet = (window as any).suiWallet;
      const accounts = await wallet.requestPermissions();
      
      // Get the connected account
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        setIsManualConnected(false);
        
        toast.success("Wallet connected", {
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
          action: {
            label: "View",
            onClick: () => window.open(`https://explorer.sui.io/address/${address}`, "_blank")
          }
        });
        
        return address;
      } else {
        throw new Error("No accounts returned from wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Connection failed", {
        description: "Could not connect to Sui Wallet. Please try again or paste your address manually."
      });
      return null;
    }
  };

  const manualConnectWallet = (address: string) => {
    if (!address || address.trim() === '') {
      toast.error("Invalid address", {
        description: "Please enter a valid Sui wallet address"
      });
      return;
    }
    
    // Basic validation - Sui addresses should be 66 characters (0x + 64 hex chars)
    const addressRegex = /^0x[a-fA-F0-9]{64}$/;
    if (!addressRegex.test(address)) {
      toast.error("Invalid address format", {
        description: "Sui addresses should be in the format 0x followed by 64 hex characters"
      });
      return;
    }
    
    setWalletAddress(address);
    setIsConnected(true);
    setIsManualConnected(true);
    
    toast.success("Address connected manually", {
      description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      action: {
        label: "View",
        onClick: () => window.open(`https://explorer.sui.io/address/${address}`, "_blank")
      }
    });
  };

  const disconnectWallet = () => {
    try {
      setIsConnected(false);
      setWalletAddress(null);
      setIsManualConnected(false);
      
      toast.info("Wallet disconnected", {
        description: "You've been safely logged out"
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
        manualConnectWallet,
        isManualConnected
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
