
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
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
        
        // Open Sui wallet installation page
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
        description: "Could not connect to Sui Wallet. Please try again."
      });
      return null;
    }
  };

  const disconnectWallet = () => {
    try {
      setIsConnected(false);
      setWalletAddress(null);
      
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
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
