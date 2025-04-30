
import { Button } from "@/components/ui/button";
import { FileJson, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateStore: () => void;
}

const EmptyState = ({ onCreateStore }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8 animate-fade-in glassmorphism">
        <div className="flex flex-col items-center">
          <div className="bg-blue-500/20 p-4 rounded-full mb-4">
            <FileJson className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            No Documents Yet
          </h3>
          <p className="text-gray-400 max-w-md mb-6">
            Create your first document to get started with ChainData storage
          </p>
          
          <Button 
            onClick={onCreateStore}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-900/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
