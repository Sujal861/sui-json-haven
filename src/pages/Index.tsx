
import { useState } from 'react';
import Header from '../components/Header';
import DocumentExplorer from '../components/DocumentExplorer';
import JsonEditor from '../components/JsonEditor';
import EmptyState from '../components/EmptyState';
import DocumentActions from '../components/DocumentActions';
import CreateStoreModal from '../components/CreateStoreModal';
import { useToast } from '@/hooks/use-toast';

type Document = {
  id: string;
  key: string;
  content: string;
  lastModified: string;
};

const Index = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [storeCreated, setStoreCreated] = useState<boolean>(false);
  const [showCreateStoreModal, setShowCreateStoreModal] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [jsonContent, setJsonContent] = useState<string>('{\n  \n}');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleConnect = (status: boolean) => {
    setConnected(status);
    if (status) {
      // For demo purposes, we'll check if a store exists
      // In a real app, we'd query the blockchain here
      setTimeout(() => {
        setStoreCreated(false);
        setShowCreateStoreModal(true);
      }, 1000);
    }
  };

  const handleCreateStore = () => {
    setIsProcessing(true);
    // Simulate blockchain transaction
    setTimeout(() => {
      setStoreCreated(true);
      setShowCreateStoreModal(false);
      setIsProcessing(false);
      toast({
        title: "Store created successfully",
        description: "Your ChainData store is ready to use",
      });
    }, 2000);
  };

  const handleAddDocument = (key: string) => {
    setIsProcessing(true);
    // Simulate adding document to blockchain
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        key,
        content: jsonContent,
        lastModified: new Date().toISOString()
      };
      
      setDocuments(prev => [...prev, newDoc]);
      setSelectedDocument(newDoc);
      setIsProcessing(false);
      
      toast({
        title: "Document added",
        description: `Document '${key}' has been added to your store`,
      });
    }, 1500);
  };

  const handleUpdateDocument = () => {
    if (!selectedDocument) return;
    
    setIsProcessing(true);
    // Simulate updating document on blockchain
    setTimeout(() => {
      const updatedDocs = documents.map(doc => {
        if (doc.id === selectedDocument.id) {
          return {
            ...doc,
            content: jsonContent,
            lastModified: new Date().toISOString()
          };
        }
        return doc;
      });
      
      const updatedDoc = updatedDocs.find(doc => doc.id === selectedDocument.id);
      setDocuments(updatedDocs);
      setSelectedDocument(updatedDoc || null);
      setIsProcessing(false);
      
      toast({
        title: "Document updated",
        description: `Document '${selectedDocument.key}' has been updated`,
      });
    }, 1500);
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;
    
    setIsProcessing(true);
    // Simulate deleting document from blockchain
    setTimeout(() => {
      const updatedDocs = documents.filter(doc => doc.id !== selectedDocument.id);
      setDocuments(updatedDocs);
      setSelectedDocument(null);
      setJsonContent('{\n  \n}');
      setIsProcessing(false);
      
      toast({
        title: "Document deleted",
        description: `Document '${selectedDocument.key}' has been deleted`,
      });
    }, 1500);
  };
  
  const selectDocument = (document: Document) => {
    setSelectedDocument(document);
    setJsonContent(document.content);
  };

  return (
    <div className="min-h-screen flex flex-col bg-chaindata-dark-blue">
      <Header connected={connected} onConnectChange={handleConnect} />
      
      <CreateStoreModal 
        isOpen={showCreateStoreModal} 
        onClose={() => setShowCreateStoreModal(false)}
        onCreate={handleCreateStore}
        isProcessing={isProcessing}
      />
      
      {!connected ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            title="Connect Your Wallet" 
            description="Connect your Sui wallet to get started with ChainData" 
            icon="wallet"
          />
        </div>
      ) : !storeCreated ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            title="Create a Store" 
            description="You need to create a ChainData store to begin" 
            icon="folder"
            action={{
              label: "Create Store",
              onClick: () => setShowCreateStoreModal(true)
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <DocumentExplorer 
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={selectDocument}
            onCreateDocument={() => {
              setSelectedDocument(null);
              setJsonContent('{\n  \n}');
            }}
          />
          
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {selectedDocument || documents.length === 0 ? (
              <>
                <DocumentActions 
                  document={selectedDocument} 
                  onAdd={handleAddDocument}
                  onUpdate={handleUpdateDocument}
                  onDelete={handleDeleteDocument}
                  isProcessing={isProcessing}
                />
                
                <div className="mt-4 flex-1 overflow-hidden">
                  <JsonEditor 
                    value={jsonContent} 
                    onChange={setJsonContent}
                    readOnly={isProcessing}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState 
                  title="Select a Document" 
                  description="Select a document from the sidebar or create a new one" 
                  icon="file-text"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
