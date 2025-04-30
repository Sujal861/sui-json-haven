
import { Database, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useChainData } from "@/hooks/useChainData";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, connectWallet, disconnectWallet } = useChainData();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center group">
          <Database className="h-5 w-5 mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
            Chain<span className="font-extrabold">Data</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/" className="nav-item hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="nav-item hover:text-blue-400 transition-colors">
            Dashboard
          </Link>
          <Link to="/settings" className="nav-item hover:text-blue-400 transition-colors">
            Settings
          </Link>
        </nav>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        {!isConnected ? (
          <Button 
            onClick={connectWallet} 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            size="sm"
          >
            Connect Wallet
          </Button>
        ) : (
          <Button 
            onClick={disconnectWallet} 
            variant="outline"
            size="sm"
          >
            Disconnect Wallet
          </Button>
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
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Link>
            
            {!isConnected ? (
              <Button 
                onClick={() => {
                  connectWallet();
                  setIsMenuOpen(false);
                }} 
                className="w-full mt-2"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  disconnectWallet();
                  setIsMenuOpen(false);
                }} 
                variant="outline"
                className="w-full mt-2"
              >
                Disconnect Wallet
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
