import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  onCreateStore: () => void;
}

const EmptyState = ({ onCreateStore }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <FileText className="w-16 h-16 text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Documents Yet</h3>
          <p className="text-gray-400 max-w-md mb-6">
            Create your first document to get started with JSON Haven
          </p>
          
          <Button 
            onClick={onCreateStore}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Create Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
