export const exampleDocuments = [
  {
    id: "example-1",
    key: "user-profile",
    content: `{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  },
  "roles": ["user", "admin"],
  "lastLogin": "2024-03-15T10:30:00Z"
}`,
    lastModified: new Date().toISOString()
  },
  {
    id: "example-2",
    key: "product-catalog",
    content: `{
  "products": [
    {
      "id": "prod-001",
      "name": "Wireless Headphones",
      "price": 199.99,
      "inStock": true,
      "specifications": {
        "batteryLife": "20 hours",
        "bluetooth": "5.0",
        "noiseCancellation": true
      }
    },
    {
      "id": "prod-002",
      "name": "Smart Watch",
      "price": 299.99,
      "inStock": true,
      "specifications": {
        "display": "1.4 inch AMOLED",
        "waterResistant": true,
        "batteryLife": "5 days"
      }
    }
  ],
  "totalProducts": 2,
  "lastUpdated": "2024-03-15"
}`,
    lastModified: new Date().toISOString()
  },
  {
    id: "example-3",
    key: "api-config",
    content: `{
  "api": {
    "baseUrl": "https://api.example.com",
    "version": "v1",
    "endpoints": {
      "users": "/users",
      "products": "/products",
      "orders": "/orders"
    },
    "authentication": {
      "type": "Bearer",
      "tokenExpiry": 3600
    },
    "rateLimit": {
      "requests": 100,
      "period": "1m"
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "destination": "file"
  }
}`,
    lastModified: new Date().toISOString()
  }
]; 