# JSON Haven Backend

A FastAPI-based backend for the JSON Haven application.

## Features

- FastAPI with async support
- SQLAlchemy with async support
- JWT authentication
- SQLite database (can be changed to PostgreSQL for production)
- CORS support
- Environment variable configuration

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following content:
```
DATABASE_URL=sqlite+aiosqlite:///./json_haven.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ENVIRONMENT=development
```

4. Run the development server:
```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- POST `/token` - Get access token
- POST `/users/` - Create new user

### Documents
- GET `/documents/` - List all documents
- POST `/documents/` - Create new document
- GET `/documents/{document_id}` - Get document by ID
- PUT `/documents/{document_id}` - Update document
- DELETE `/documents/{document_id}` - Delete document

## Development

### Project Structure
```
backend/
├── main.py           # FastAPI application
├── models.py         # SQLAlchemy models
├── schemas.py        # Pydantic schemas
├── crud.py          # CRUD operations
├── database.py      # Database connection
├── auth.py          # Authentication
├── requirements.txt # Dependencies
└── .env            # Environment variables
```

### Adding New Features

1. Define models in `models.py`
2. Create schemas in `schemas.py`
3. Add CRUD operations in `crud.py`
4. Create new endpoints in `main.py`

## Production Deployment

For production:
1. Change database to PostgreSQL
2. Set proper SECRET_KEY
3. Enable HTTPS
4. Set proper CORS origins
5. Use proper password hashing
6. Add rate limiting
7. Add logging
8. Add monitoring 