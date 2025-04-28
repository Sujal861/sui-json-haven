
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Save, Trash, Plus } from "lucide-react";

interface Document {
  id: string;
  key: string;
  content: string;
  lastModified: string;
}

interface DocumentActionsProps {
  document: Document | null;
  onAdd: (key: string) => void;
  onUpdate: () => void;
  onDelete: () => void;
  isProcessing: boolean;
}

const DocumentActions = ({
  document,
  onAdd,
  onUpdate,
  onDelete,
  isProcessing
}: DocumentActionsProps) => {
  const [documentKey, setDocumentKey] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (!document && documentKey.trim()) {
      onAdd(documentKey);
      setDocumentKey("");
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
      <div className="flex items-center space-x-4">
        {document ? (
          <>
            <span className="font-medium text-lg">{document.key}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={onUpdate}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-900/20 text-red-400 hover:bg-red-900/10"
                onClick={onDelete}
                disabled={isProcessing}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : showInput ? (
          <div className="flex items-center space-x-2">
            <Input
              value={documentKey}
              onChange={(e) => setDocumentKey(e.target.value)}
              placeholder="Document key"
              className="w-64 bg-chaindata-dark border-gray-700"
              disabled={isProcessing}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Button
              variant="outline"
              size="sm"
              className="bg-chaindata-blue text-white border-0 hover:bg-chaindata-blue/80"
              onClick={handleAdd}
              disabled={isProcessing || !documentKey.trim()}
            >
              {isProcessing ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-white"
              onClick={() => setShowInput(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => setShowInput(true)}
            disabled={isProcessing}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Document
          </Button>
        )}
      </div>
      
      {document && (
        <div className="text-xs text-gray-500">
          Last modified: {new Date(document.lastModified).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default DocumentActions;
