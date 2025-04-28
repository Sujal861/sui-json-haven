import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (key: string) => void;
}

const CreateStoreModal = ({ 
  isOpen, 
  onClose, 
  onAddDocument
}: CreateStoreModalProps) => {
  const [documentKey, setDocumentKey] = useState("");

  const handleCreate = () => {
    if (documentKey.trim()) {
      onAddDocument(documentKey);
      setDocumentKey("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0B0E] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create New Document</DialogTitle>
          <DialogDescription>
            Create a new JSON document in your workspace.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="documentKey" className="text-white">Document Key</Label>
          <Input 
            id="documentKey"
            value={documentKey}
            onChange={(e) => setDocumentKey(e.target.value)} 
            placeholder="Enter document key"
            className="mt-1 bg-[#141619] border-gray-700"
          />
          
          <p className="mt-4 text-sm text-gray-400">
            The document key will be used to identify your JSON document in the workspace.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={!documentKey.trim()}
          >
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;
