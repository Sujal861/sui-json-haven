
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  connected: boolean;
  onConnectChange: (status: boolean) => void;
}

const Header = ({ connected, onConnectChange }: HeaderProps) => {
  const [address, setAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const handleConnectClick = async () => {
    if (connected) {
      // Disconnect wallet
      setAddress("");
      onConnectChange(false);
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(36).substring(2, 15);
      setAddress(mockAddress);
      setIsConnecting(false);
      onConnectChange(true);
    }, 1500);
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="flex items-center">
        <span className="text-xl font-bold bg-gradient-to-r from-chaindata-blue to-chaindata-teal bg-clip-text text-transparent">
          Chain<span className="font-extrabold">Data</span>
        </span>
        <span className="ml-2 text-xs px-2 py-0.5 bg-chaindata-blue/20 text-chaindata-blue rounded-full">
          Sui Walrus Storage
        </span>
      </div>
      
      <Button
        variant={connected ? "outline" : "default"}
        onClick={handleConnectClick}
        disabled={isConnecting}
        className={`${connected ? 'bg-transparent text-white border-gray-700' : ''}`}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? (
          <span className="animate-pulse">Connecting...</span>
        ) : connected ? (
          formatAddress(address)
        ) : (
          "Connect Wallet"
        )}
      </Button>
    </header>
  );
};

export default Header;
