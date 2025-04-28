
import { Button } from "@/components/ui/button";
import { Database, Wallet } from "lucide-react";
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
    <header className="header flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Chain<span className="font-extrabold">Data</span>
          </span>
          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
            Sui Walrus Storage
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-2">
          <a href="#" className="nav-item">Documents</a>
          <a href="#" className="nav-item">Explorer</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>
      </div>
      
      <Button
        variant={connected ? "outline" : "default"}
        onClick={handleConnectClick}
        disabled={isConnecting}
        className={`${connected ? 'glassmorphism border-white/20 hover:bg-white/10' : 'btn-primary'}`}
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
