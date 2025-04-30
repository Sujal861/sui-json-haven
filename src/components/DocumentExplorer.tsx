
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileJson, Filter } from "lucide-react";
import { useState } from "react";
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

interface DocumentExplorerProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  onAddDocument: () => void;
}

const DocumentExplorer = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onAddDocument,
}: DocumentExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');

  const filteredDocuments = documents.filter(doc =>
    doc.key.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'oldest':
        return new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
      case 'name':
        return a.key.localeCompare(b.key);
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="w-full h-full border border-gray-800 rounded-lg flex flex-col glassmorphism">
      <div className="p-4 border-b border-gray-800">
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
          onClick={onAddDocument}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>

        <div className="mt-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents..."
            className="pl-8 bg-black/40 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-800">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem 
                className={sortOrder === 'newest' ? "bg-blue-900/20 text-blue-400" : ""}
                onClick={() => setSortOrder('newest')}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortOrder === 'oldest' ? "bg-blue-900/20 text-blue-400" : ""}
                onClick={() => setSortOrder('oldest')}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortOrder === 'name' ? "bg-blue-900/20 text-blue-400" : ""}
                onClick={() => setSortOrder('name')}
              >
                Name (A-Z)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {sortedDocuments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No documents found" : "No documents yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {sortedDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 cursor-pointer hover:bg-blue-500/10 transition-colors ${
                  selectedDocument?.id === doc.id
                    ? "bg-blue-500/20 border-l-2 border-blue-500"
                    : ""
                }`}
                onClick={() => onSelectDocument(doc)}
              >
                <div className="flex items-start">
                  <FileJson className="h-4 w-4 mt-1 mr-2 text-blue-400 flex-shrink-0" />
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
