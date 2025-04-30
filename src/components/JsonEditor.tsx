
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Check, Users } from "lucide-react";
import { collaborationService, Participant } from "@/services/collaborationService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  documentId?: string; // ID for collaborative editing
}

const JsonEditor = ({ value, onChange, readOnly = false, documentId }: JsonEditorProps) => {
  const [formattedValue, setFormattedValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize collaborative editing when documentId changes
  useEffect(() => {
    if (!documentId) return;
    
    collaborationService.setParticipantsChangeListener((newParticipants) => {
      setParticipants(newParticipants);
    });
    
    collaborationService.setDocumentChangeListener((newContent) => {
      if (newContent !== formattedValue) {
        setFormattedValue(newContent);
        onChange(newContent);
      }
    });
    
    return () => {
      collaborationService.setParticipantsChangeListener(null);
      collaborationService.setDocumentChangeListener(null);
    };
  }, [documentId]);
  
  const toggleCollaboration = async () => {
    if (isCollaborating) {
      collaborationService.leaveRoom();
      setIsCollaborating(false);
      setParticipants([]);
    } else {
      if (documentId) {
        const success = await collaborationService.joinRoom(documentId, formattedValue);
        if (success) {
          setIsCollaborating(true);
        }
      } else {
        toast.error("Cannot start collaboration", { 
          description: "Document must be saved first" 
        });
      }
    }
  };
  
  useEffect(() => {
    try {
      // If empty, provide default template
      if (!value || !value.trim()) {
        setFormattedValue('{\n  \n}');
        setError(null);
        setIsValid(true);
        return;
      }
      
      // Try to parse and format JSON
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedValue(formatted);
      setError(null);
      setIsValid(true);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid JSON");
      }
      setIsValid(false);
      // Keep the current value even if it's invalid
      setFormattedValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setFormattedValue(newValue);
    onChange(newValue);
    
    if (isCollaborating) {
      collaborationService.updateDocument(newValue);
    }
  };

  const formatJson = (json: string): JSX.Element => {
    try {
      // If empty, provide default template
      if (!json || !json.trim()) {
        return <div className="font-mono whitespace-pre">{'{\n  \n}'}</div>;
      }
      
      const parsed = JSON.parse(json);
      const formatted = JSON.stringify(parsed, null, 2);
      
      // Enhanced syntax highlighting with nested object support
      const formatLine = (line: string, index: number): JSX.Element => {
        // Match key and value parts
        const keyMatch = line.match(/^(\s*)(".*?")(:)/);
        
        if (!keyMatch) return <div key={index}>{line}</div>;
        
        const [, spaces, key, colon] = keyMatch;
        const keySpan = <span className="json-key">{key}</span>;
        
        // Extract the value part
        const afterColon = line.substring(line.indexOf(':') + 1);
        
        let valueSpan;
        if (afterColon.trim().match(/^".*?"(,?)$/)) {
          valueSpan = <span className="json-string">{afterColon}</span>;
        } else if (afterColon.trim().match(/^(true|false)(,?)$/)) {
          valueSpan = <span className="json-boolean">{afterColon}</span>;
        } else if (afterColon.trim().match(/^null(,?)$/)) {
          valueSpan = <span className="json-null">{afterColon}</span>;
        } else if (afterColon.trim().match(/^-?\d+(\.\d+)?(e[+-]?\d+)?(,?)$/i)) {
          valueSpan = <span className="json-number">{afterColon}</span>;
        } else {
          valueSpan = afterColon;
        }
        
        return (
          <div key={index} className="hover:bg-white/5">
            {spaces}{keySpan}{colon} {valueSpan}
          </div>
        );
      };
      
      return (
        <div className="font-mono whitespace-pre text-sm">
          {formatted.split('\n').map((line, i) => formatLine(line, i))}
        </div>
      );
    } catch {
      return <div className="font-mono whitespace-pre">{json}</div>;
    }
  };

  return (
    <Card className="h-full editor-container">
      <CardContent className="p-0 h-full">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
          <div className="flex items-center">
            {isValid ? (
              <div className="flex items-center text-green-400">
                <Check size={16} className="mr-2" />
                <span className="text-xs">Valid JSON</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <AlertCircle size={16} className="mr-2" />
                <span className="text-xs">Invalid JSON</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              {formattedValue ? JSON.stringify(formattedValue).length : 0} bytes
            </div>
            
            {documentId && (
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 ${isCollaborating ? 'text-blue-400' : 'text-gray-400'}`}
                onClick={toggleCollaboration}
              >
                <Users size={16} />
                <span className="text-xs">
                  {isCollaborating 
                    ? `${participants.length} ${participants.length === 1 ? 'user' : 'users'}`
                    : 'Collaborate'
                  }
                </span>
              </Button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/20 text-red-400 text-sm p-2 border-b border-red-900">
            <div className="flex items-center">
              <AlertCircle size={14} className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {isCollaborating && participants.length > 0 && (
          <div className="flex items-center space-x-2 p-2 border-b border-gray-800 bg-blue-900/10">
            {participants.map(participant => (
              <div 
                key={participant.id} 
                className="flex items-center" 
                title={participant.name}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: participant.color }}
                />
                {participant.id === collaborationService.getCurrentUserId() && (
                  <span className="text-xs text-gray-400">(You)</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!readOnly ? (
          <textarea
            ref={textAreaRef}
            value={formattedValue}
            onChange={handleChange}
            className="w-full h-[calc(100%-40px)] p-4 font-mono text-sm resize-none bg-transparent focus:outline-none"
            disabled={readOnly}
            placeholder="Enter JSON here..."
            spellCheck="false"
          />
        ) : (
          <div className="w-full h-[calc(100%-40px)] overflow-auto p-4 text-sm opacity-70">
            {formatJson(formattedValue)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JsonEditor;
