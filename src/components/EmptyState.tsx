
import { Button } from "@/components/ui/button";
import { Wallet, Folder, FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: "wallet" | "folder" | "file-text";
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  const getIcon = () => {
    switch (icon) {
      case "wallet":
        return <Wallet className="w-16 h-16 text-chaindata-blue mb-4" />;
      case "folder":
        return <Folder className="w-16 h-16 text-chaindata-blue mb-4" />;
      case "file-text":
        return <FileText className="w-16 h-16 text-chaindata-blue mb-4" />;
    }
  };

  return (
    <div className="text-center p-8 animate-fade-in">
      <div className="flex flex-col items-center">
        {getIcon()}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 max-w-md mb-6">{description}</p>
        
        {action && (
          <Button 
            onClick={action.onClick}
            className="bg-chaindata-blue hover:bg-chaindata-blue/80"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
