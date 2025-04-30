
import { useState, useEffect } from "react";
import { Wallet, LayoutDashboard, Settings, Menu, X, ClipboardPaste } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WalletDisplay from "./WalletDisplay";
import { useWallet } from "@/providers/WalletProvider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const { isConnected, connectWallet, disconnectWallet, walletAddress, manualConnectWallet } = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (!address) {
      // If connection fails, show the manual input option after a timeout
      setTimeout(() => {
        setShowManualInput(true);
      }, 1500);
    }
  };

  const handleManualConnect = () => {
    manualConnectWallet(manualAddress);
    setShowManualInput(false);
    setManualAddress("");
  };

  useEffect(() => {
    const handlePasteEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.address) {
        setManualAddress(customEvent.detail.address);
        setShowManualInput(true);
      }
    };

    document.addEventListener('wallet-address-paste', handlePasteEvent);
    return () => {
      document.removeEventListener('wallet-address-paste', handlePasteEvent);
    };
  }, []);

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setManualAddress(text);
    } catch (error) {
      console.error("Error pasting from clipboard:", error);
      toast.error("Clipboard access denied", {
        description: "Please paste the address manually"
      });
    }
  };

  return (
    <header className="header flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-4">
        <RouterLink to="/" className="flex items-center group">
          <Wallet className="h-5 w-5 mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
            Chain<span className="font-extrabold">Data</span>
          </span>
        </RouterLink>
        
        <nav className="hidden md:flex items-center space-x-1">
          <RouterLink to="/" className="nav-item hover:text-blue-400 transition-colors">
            Home
          </RouterLink>
          <RouterLink to="/dashboard" className="nav-item hover:text-blue-400 transition-colors">
            Dashboard
          </RouterLink>
          <RouterLink to="/settings" className="nav-item hover:text-blue-400 transition-colors">
            Settings
          </RouterLink>
        </nav>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        {!isConnected ? (
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              size="sm"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
            
            <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Enter Wallet Address</DialogTitle>
                  <DialogDescription>
                    Paste your Sui wallet address below to connect manually.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Input
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="0x..."
                      className="font-mono text-xs"
                    />
                  </div>
                  <Button size="icon" variant="outline" onClick={handlePasteAddress}>
                    <ClipboardPaste className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-end">
                  <Button 
                    type="button" 
                    onClick={handleManualConnect} 
                    disabled={!manualAddress}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Connect
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <WalletDisplay walletAddress={walletAddress} />
            <Button 
              onClick={disconnectWallet} 
              variant="outline"
              size="sm"
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-gray-400" />
        ) : (
          <Menu className="h-6 w-6 text-gray-400" />
        )}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-white/10 p-4 md:hidden">
          <nav className="flex flex-col space-y-3">
            <RouterLink 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Home</span>
            </RouterLink>
            <RouterLink 
              to="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span>Dashboard</span>
            </RouterLink>
            <RouterLink 
              to="/settings" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </RouterLink>
            
            {!isConnected ? (
              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  onClick={() => {
                    handleConnectWallet();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowManualInput(true);
                    setIsMenuOpen(false);
                  }} 
                  className="w-full"
                >
                  <ClipboardPaste className="mr-2 h-4 w-4" />
                  Paste Wallet Address
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <WalletDisplay walletAddress={walletAddress} />
                <Button 
                  onClick={() => {
                    disconnectWallet();
                    setIsMenuOpen(false);
                  }} 
                  variant="outline"
                  className="w-full"
                >
                  Disconnect Wallet
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}

      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Wallet Address</DialogTitle>
            <DialogDescription>
              Paste your Sui wallet address below to connect manually.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono text-xs"
              />
            </div>
            <Button size="icon" variant="outline" onClick={handlePasteAddress}>
              <ClipboardPaste className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              onClick={handleManualConnect} 
              disabled={!manualAddress}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
