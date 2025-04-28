
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  isProcessing: boolean;
}

const CreateStoreModal = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  isProcessing 
}: CreateStoreModalProps) => {
  const [storeName, setStoreName] = useState("MyDocumentStore");

  const handleCreate = () => {
    if (storeName.trim()) {
      onCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-chaindata-dark-blue border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create ChainData Store</DialogTitle>
          <DialogDescription>
            Create a new on-chain JSON document store using Sui Walrus storage primitives.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="storeName" className="text-white">Store name</Label>
          <Input 
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)} 
            placeholder="Enter store name"
            className="mt-1 bg-chaindata-dark border-gray-700"
            disabled={isProcessing}
          />
          
          <p className="mt-4 text-sm text-muted-foreground">
            This will create a new document store on the Sui blockchain using Walrus storage primitives.
            All your JSON documents will be stored on-chain.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-white"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-chaindata-blue hover:bg-chaindata-blue/80"
            disabled={isProcessing || !storeName.trim()}
          >
            {isProcessing ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Store"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;
