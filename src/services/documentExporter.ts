
import { saveAs } from 'file-saver';

export interface ExportOptions {
  format: 'json' | 'text' | 'yaml' | 'csv';
  pretty?: boolean;
}

export const exportDocument = (document: { key: string; content: string }, options: ExportOptions): void => {
  let fileContent: string;
  let fileType: string;
  let fileName: string = document.key.replace(/\s+/g, '_').toLowerCase();
  
  switch (options.format) {
    case 'json':
      try {
        const jsonContent = JSON.parse(document.content);
        fileContent = options.pretty 
          ? JSON.stringify(jsonContent, null, 2) 
          : JSON.stringify(jsonContent);
        fileType = 'application/json';
        fileName = `${fileName}.json`;
      } catch (e) {
        throw new Error('Invalid JSON content');
      }
      break;
      
    case 'text':
      fileContent = document.content;
      fileType = 'text/plain';
      fileName = `${fileName}.txt`;
      break;
      
    case 'yaml':
      try {
        // Convert JSON to YAML format
        const jsonContent = JSON.parse(document.content);
        fileContent = jsonToYaml(jsonContent);
        fileType = 'application/x-yaml';
        fileName = `${fileName}.yaml`;
      } catch (e) {
        throw new Error('Invalid JSON content for YAML conversion');
      }
      break;
      
    case 'csv':
      try {
        // Convert JSON to CSV format (only works for arrays of objects)
        const jsonContent = JSON.parse(document.content);
        fileContent = jsonToCsv(jsonContent);
        fileType = 'text/csv';
        fileName = `${fileName}.csv`;
      } catch (e) {
        throw new Error('Invalid JSON content for CSV conversion');
      }
      break;
      
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
  
  const blob = new Blob([fileContent], { type: fileType });
  saveAs(blob, fileName);
};

export const importDocument = (file: File): Promise<{ key: string; content: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileName = file.name.replace(/\.\w+$/, ''); // Remove extension
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Detect file type and handle appropriately
        if (file.name.endsWith('.json')) {
          // Validate JSON
          JSON.parse(content);
          resolve({ key: fileName, content });
        } 
        else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          // Convert YAML to JSON
          const jsonContent = yamlToJson(content);
          resolve({ key: fileName, content: JSON.stringify(jsonContent, null, 2) });
        }
        else if (file.name.endsWith('.csv')) {
          // Convert CSV to JSON
          const jsonContent = csvToJson(content);
          resolve({ key: fileName, content: JSON.stringify(jsonContent, null, 2) });
        }
        else {
          // Assume it's raw JSON text
          try {
            // Check if it's valid JSON
            JSON.parse(content);
            resolve({ key: fileName, content });
          } catch (e) {
            reject(new Error('Unsupported file format or invalid content'));
          }
        }
      } catch (e) {
        reject(e);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

// Helper for converting JSON to YAML
function jsonToYaml(json: any, indent = 0): string {
  if (json === null) return 'null\n';
  if (json === undefined) return 'undefined\n';
  
  const spaces = ' '.repeat(indent);
  
  if (typeof json === 'string') return `${json}\n`;
  if (typeof json === 'number' || typeof json === 'boolean') return `${json}\n`;
  
  if (Array.isArray(json)) {
    if (json.length === 0) return '[]\n';
    
    let result = '';
    for (const item of json) {
      result += `${spaces}- `;
      if (typeof item === 'object' && item !== null) {
        result += '\n' + jsonToYaml(item, indent + 2);
      } else {
        result += jsonToYaml(item, 0).trimEnd() + '\n';
      }
    }
    return result;
  }
  
  if (typeof json === 'object') {
    if (Object.keys(json).length === 0) return '{}\n';
    
    let result = '';
    for (const [key, value] of Object.entries(json)) {
      result += `${spaces}${key}: `;
      if (typeof value === 'object' && value !== null) {
        result += '\n' + jsonToYaml(value, indent + 2);
      } else {
        result += jsonToYaml(value, 0).trimEnd() + '\n';
      }
    }
    return result;
  }
  
  return `${json}\n`;
}

// Helper for converting YAML to JSON (simplified)
function yamlToJson(yaml: string): any {
  // This is a very simplified parser for demo purposes
  // In a real app, use a proper YAML parser library
  // For now, we'll just handle basic cases
  const lines = yaml.split('\n');
  const result: any = {};
  
  // Very basic parsing that only handles simple key-value pairs
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const parts = trimmed.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      result[key] = value;
    }
  }
  
  return result;
}

// Helper for converting JSON to CSV
function jsonToCsv(json: any[]): string {
  if (!Array.isArray(json) || json.length === 0) {
    return '';
  }
  
  // Get headers (assuming all objects have the same structure)
  const headers = Object.keys(json[0]);
  let csv = headers.join(',') + '\n';
  
  // Add rows
  for (const row of json) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  }
  
  return csv;
}

// Helper for converting CSV to JSON
function csvToJson(csv: string): any[] {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];
  
  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim());
  const result: any[] = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const data = lines[i].split(',');
    const obj: any = {};
    
    headers.forEach((header, index) => {
      obj[header] = data[index] ? data[index].trim() : '';
    });
    
    result.push(obj);
  }
  
  return result;
}
