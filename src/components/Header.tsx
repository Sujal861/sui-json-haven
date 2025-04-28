import { Database } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            JSON<span className="font-extrabold">Haven</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="nav-item hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/settings" className="nav-item hover:text-blue-400 transition-colors">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
