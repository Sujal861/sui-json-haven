import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Document {
  id: number;
  key: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.post('/token', {
      username,
      password,
    });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/', {
      username,
      email,
      password,
    });
    return response.data;
  },
};

export const documents = {
  list: async () => {
    const response = await api.get<Document[]>('/documents/');
    return response.data;
  },
  
  get: async (id: number) => {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
  },
  
  create: async (key: string, content: string) => {
    const response = await api.post<Document>('/documents/', {
      key,
      content,
    });
    return response.data;
  },
  
  update: async (id: number, key: string, content: string) => {
    const response = await api.put<Document>(`/documents/${id}`, {
      key,
      content,
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    await api.delete(`/documents/${id}`);
  },
};

export default api; 