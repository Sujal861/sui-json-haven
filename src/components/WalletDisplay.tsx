
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet } from "lucide-react";
import { useTooltip } from "@radix-ui/react-tooltip";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WalletDisplayProps {
  walletAddress: string | null;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ walletAddress }) => {
  if (!walletAddress) return null;
  
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    // Toast notification handled by Header component
  };

  const viewInExplorer = () => {
    window.open(`https://explorer.sui.io/address/${walletAddress}`, '_blank');
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-950/30 rounded-full cursor-pointer border border-blue-800/30" onClick={copyToClipboard}>
            <Wallet className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-mono text-gray-300">{shortAddress}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy full address</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-transparent border border-blue-800/30" 
            onClick={viewInExplorer}
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View in Sui Explorer</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default WalletDisplay;
