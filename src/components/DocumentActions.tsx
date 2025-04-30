
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash, Files, FileExport, FileImport } from "lucide-react";
import { exportDocument, importDocument } from "@/services/documentExporter";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
  onImport?: (document: { key: string; content: string }) => void;
}

const DocumentActions = ({
  document,
  onUpdate,
  onDelete,
  onImport
}: DocumentActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = (format: 'json' | 'text' | 'yaml' | 'csv', pretty = true) => {
    try {
      exportDocument(document, { format, pretty });
      toast.success(`Document exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Export failed", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    
    try {
      const importedDoc = await importDocument(file);
      onImport(importedDoc);
      toast.success("Document imported successfully");
    } catch (error) {
      toast.error("Import failed", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
    }
    
    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
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
          
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <FileExport className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-gray-900 border-gray-800">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem onClick={() => handleExport('json')}>
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('yaml')}>
                YAML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('text')}>
                Plain Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Import Button */}
          {onImport && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={handleImportClick}
              >
                <FileImport className="h-4 w-4 mr-1" />
                Import
              </Button>
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json,.csv,.yaml,.yml,.txt"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentActions;
