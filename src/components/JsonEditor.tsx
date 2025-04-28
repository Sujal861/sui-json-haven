import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const JsonEditor = ({ value, onChange, readOnly = false }: JsonEditorProps) => {
  const [formattedValue, setFormattedValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // If empty, provide default template
      if (!value || !value.trim()) {
        setFormattedValue('{\n  \n}');
        setError(null);
        return;
      }
      
      // Try to parse and format JSON
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedValue(formatted);
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid JSON");
      }
      // Keep the current value even if it's invalid
      setFormattedValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setFormattedValue(newValue);
    onChange(newValue);
  };

  const formatJson = (json: string): JSX.Element => {
    // For a simple highlighting approach since this is a prototype
    // In a real app, we would use a proper syntax highlighting library
    try {
      // If empty, provide default template
      if (!json || !json.trim()) {
        return <div className="font-mono whitespace-pre">{'{'}\n  \n{'}'}</div>;
      }
      
      const parsed = JSON.parse(json);
      const formatted = JSON.stringify(parsed, null, 2);
      
      // Simple regex-based highlighting
      return (
        <div className="font-mono whitespace-pre">
          {formatted.split('\n').map((line, i) => {
            // Very basic highlighting
            const keyMatch = line.match(/^(\s*)(".*?"):/);
            const valueMatch = line.match(/:\s*(.*?)$/);
            
            if (!keyMatch) return <div key={i}>{line}</div>;
            
            const [, spaces, key] = keyMatch;
            const keySpan = <span className="json-key">{key}</span>;
            
            if (!valueMatch) return (
              <div key={i}>{spaces}{keySpan}:</div>
            );
            
            const [, value] = valueMatch;
            
            let valueSpan;
            if (value.match(/^".*?"(,?)$/)) {
              valueSpan = <span className="json-string">{value}</span>;
            } else if (value.match(/^(true|false)(,?)$/)) {
              valueSpan = <span className="json-boolean">{value}</span>;
            } else if (value.match(/^null(,?)$/)) {
              valueSpan = <span className="json-null">{value}</span>;
            } else if (value.match(/^-?\d+(\.\d+)?(e[+-]?\d+)?(,?)$/i)) {
              valueSpan = <span className="json-number">{value}</span>;
            } else {
              valueSpan = value;
            }
            
            return (
              <div key={i}>
                {spaces}{keySpan}: {valueSpan}
              </div>
            );
          })}
        </div>
      );
    } catch {
      return <div className="font-mono whitespace-pre">{json}</div>;
    }
  };

  return (
    <Card className="h-full editor-container">
      <CardContent className="p-0 h-full">
        {error && (
          <div className="bg-red-900/20 text-red-400 text-sm p-2 border-b border-red-900">
            {error}
          </div>
        )}
        
        {!readOnly ? (
          <textarea
            value={formattedValue}
            onChange={handleChange}
            className="w-full h-full p-4 font-mono text-sm resize-none bg-transparent focus:outline-none"
            disabled={readOnly}
            placeholder="Enter JSON here..."
          />
        ) : (
          <div className="w-full h-full overflow-auto p-4 text-sm opacity-70">
            {formatJson(formattedValue)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JsonEditor;
