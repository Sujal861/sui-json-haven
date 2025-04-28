
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText } from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  key: string;
  content: string;
  lastModified: string;
}

interface DocumentExplorerProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  onCreateDocument: () => void;
}

const DocumentExplorer = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onCreateDocument,
}: DocumentExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(doc =>
    doc.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="w-72 border-r border-gray-800 flex flex-col bg-chaindata-dark">
      <div className="p-4 border-b border-gray-800">
        <Button
          variant="outline"
          className="w-full bg-chaindata-blue text-white border-0 hover:bg-chaindata-blue/80"
          onClick={onCreateDocument}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>

        <div className="mt-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents..."
            className="pl-8 bg-chaindata-dark-blue border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredDocuments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No documents found" : "No documents yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 cursor-pointer hover:bg-chaindata-blue/10 transition-colors ${
                  selectedDocument?.id === doc.id
                    ? "bg-chaindata-blue/20 border-l-2 border-chaindata-blue"
                    : ""
                }`}
                onClick={() => onSelectDocument(doc)}
              >
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mt-1 mr-2 text-chaindata-blue" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{doc.key}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(doc.lastModified)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentExplorer;
