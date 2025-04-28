import { Button } from "@/components/ui/button";
import { Save, Trash } from "lucide-react";

interface Document {
  id: string;
  key: string;
  content: string;
  lastModified: string;
}

interface DocumentActionsProps {
  document: Document;
  onUpdate: () => void;
  onDelete: () => void;
}

const DocumentActions = ({
  document,
  onUpdate,
  onDelete,
}: DocumentActionsProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <span className="font-medium text-lg">{document.key}</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={onUpdate}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-900/20 text-red-400 hover:bg-red-900/10"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentActions;
