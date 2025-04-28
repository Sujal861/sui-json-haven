import { useState } from 'react';
import Header from '../components/Header';
import DocumentExplorer from '../components/DocumentExplorer';
import JsonEditor from '../components/JsonEditor';
import EmptyState from '../components/EmptyState';
import DocumentActions from '../components/DocumentActions';
import CreateStoreModal from '../components/CreateStoreModal';
import { useToast } from '@/hooks/use-toast';
import { exampleDocuments } from '@/data/examples';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Document {
  id: string;
  key: string;
  content: string;
  lastModified: string;
}

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <Card className="bg-black/20 border border-white/10">
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateStore = () => {
    setIsCreateModalOpen(true);
  };

  const handleLoadExamples = () => {
    setDocuments(exampleDocuments);
    setSelectedDocument(exampleDocuments[0]);
    toast({
      title: "Examples Loaded",
      description: "Example documents have been loaded successfully.",
    });
  };

  const handleAddDocument = (key: string) => {
    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      key,
      content: '{\n  \n}',
      lastModified: new Date().toISOString()
    };
    setDocuments([...documents, newDoc]);
    setSelectedDocument(newDoc);
    toast({
      title: "Success",
      description: "Document created successfully",
    });
  };

  const handleUpdateDocument = () => {
    if (!selectedDocument) return;
    
    const updatedDocuments = documents.map(doc =>
      doc.id === selectedDocument.id ? selectedDocument : doc
    );
    setDocuments(updatedDocuments);
    toast({
      title: "Success",
      description: "Document updated successfully",
    });
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;
    
    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    setDocuments(updatedDocuments);
    setSelectedDocument(null);
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };

  const selectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0B0E] to-[#141619]">
      <Header />
      
      <main className="container mx-auto px-4 pt-20">
        {documents.length === 0 ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">
                JSON Editor & Management
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                A powerful, user-friendly JSON editor with syntax highlighting, validation, and management features.
              </p>
            </div>

            {/* Getting Started Section */}
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <EmptyState onCreateStore={handleCreateStore} />
                <Button
                  variant="outline"
                  onClick={handleLoadExamples}
                  className="mt-4"
                >
                  Load Example Documents
                </Button>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FeatureCard
                  title="JSON Document Management"
                  description="Create, edit, and manage JSON documents with custom keys and names. Delete documents when no longer needed."
                />
                <FeatureCard
                  title="Modern Interface"
                  description="Dark-themed interface with split-screen layout. Document explorer on the left, JSON editor on the right."
                />
                <FeatureCard
                  title="Advanced Editor"
                  description="Real-time JSON validation, syntax highlighting, auto-formatting, and error detection."
                />
                <FeatureCard
                  title="Example Templates"
                  description="Pre-built templates for user profiles, product catalogs, and API configurations."
                />
                <FeatureCard
                  title="User Experience"
                  description="Toast notifications, empty state handling, and intuitive document navigation."
                />
                <FeatureCard
                  title="Technical Features"
                  description="Built with React and TypeScript. Modern UI components and robust state management."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <DocumentExplorer
                documents={documents}
                selectedDocument={selectedDocument}
                onSelectDocument={selectDocument}
                onAddDocument={handleCreateStore}
              />
            </div>
            
            <div className="col-span-9">
              {selectedDocument && (
                <>
                  <DocumentActions
                    document={selectedDocument}
                    onUpdate={handleUpdateDocument}
                    onDelete={handleDeleteDocument}
                  />
                  <JsonEditor
                    value={selectedDocument.content}
                    onChange={(content) =>
                      setSelectedDocument({ ...selectedDocument, content })
                    }
                  />
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddDocument={handleAddDocument}
      />
    </div>
  );
};

export default Index;
