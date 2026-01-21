# AI Tools Platform - API Documentation

Base URL: `http://localhost:8201/api` (development)

All API responses are in JSON format.

---

## 🔓 Public Endpoints (No Authentication Required)

### Health Check

```http
GET /api/status
```

**Response:**
```json
{
  "status": "ok",
  "message": "AI Tools API is running",
  "timestamp": "2026-01-21 12:00:00"
}
```

---

### Authentication

#### Register

```http
POST /api/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role_id": 1
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 1,
      "name": "developer",
      "display_name": "Developer"
    }
  },
  "token": "1|laravel_sanctum_token_here"
}
```

**Validation Errors (422):**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

#### Login

```http
POST /api/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 1,
      "name": "developer",
      "display_name": "Developer"
    }
  },
  "token": "2|laravel_sanctum_token_here"
}
```

**Invalid Credentials (422):**
```json
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

---

### Roles

#### Get All Roles

```http
GET /api/roles
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "developer",
      "display_name": "Developer",
      "created_at": "2026-01-21T12:00:00.000000Z",
      "updated_at": "2026-01-21T12:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "designer",
      "display_name": "Designer",
      "created_at": "2026-01-21T12:00:00.000000Z",
      "updated_at": "2026-01-21T12:00:00.000000Z"
    }
  ]
}
```

#### Get Single Role

```http
GET /api/roles/{id}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "developer",
    "display_name": "Developer",
    "created_at": "2026-01-21T12:00:00.000000Z",
    "updated_at": "2026-01-21T12:00:00.000000Z"
  }
}
```

---

### Categories

#### Get All Categories

```http
GET /api/categories
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Code Assistants",
      "slug": "code-assistants",
      "description": "AI tools that help with coding",
      "created_at": "2026-01-21T12:00:00.000000Z",
      "updated_at": "2026-01-21T12:00:00.000000Z"
    }
  ]
}
```

#### Get Category by Slug

```http
GET /api/categories/{slug}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Code Assistants",
    "slug": "code-assistants",
    "description": "AI tools that help with coding",
    "created_at": "2026-01-21T12:00:00.000000Z",
    "updated_at": "2026-01-21T12:00:00.000000Z"
  }
}
```

---

### Tags

#### Get All Tags

```http
GET /api/tags
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Free",
      "slug": "free",
      "color": "#22c55e",
      "created_at": "2026-01-21T12:00:00.000000Z",
      "updated_at": "2026-01-21T12:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Paid",
      "slug": "paid",
      "color": "#3b82f6",
      "created_at": "2026-01-21T12:00:00.000000Z",
      "updated_at": "2026-01-21T12:00:00.000000Z"
    }
  ]
}
```

---

### AI Tools

#### Get All Tools

```http
GET /api/tools
```

**Query Parameters:**
- `search` (optional) - Search in name, description
- `category_id` (optional) - Filter by category
- `tag_ids` (optional) - Filter by tags (comma-separated)
- `role_id` (optional) - Filter by suitable role
- `per_page` (optional) - Items per page (default: 15)
- `page` (optional) - Page number

**Example:**
```http
GET /api/tools?search=ChatGPT&category_id=1&per_page=20
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "slug": "chatgpt",
      "description": "Conversational AI assistant",
      "url": "https://chat.openai.com",
      "documentation_url": "https://platform.openai.com/docs",
      "how_to_use": "Visit the website and start chatting...",
      "examples": "Example use cases...",
      "logo_url": "https://example.com/logo.png",
      "images": [],
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "Code Assistants",
        "slug": "code-assistants"
      },
      "created_by": 1,
      "creator": {
        "id": 1,
        "name": "John Doe",
        "role": {
          "id": 1,
          "name": "developer",
          "display_name": "Developer"
        }
      },
      "suitable_for_roles": [1, 2, 3],
      "status": "active",
      "views_count": 150,
      "tags": [
        {
          "id": 1,
          "name": "Free",
          "slug": "free",
          "color": "#22c55e"
        }
      ],
      "average_rating": 4.5,
      "recommendations_count": 10,
      "created_at": "2026-01-21T12:00:00.000000Z",
      "updated_at": "2026-01-21T12:00:00.000000Z"
    }
  ],
  "links": {
    "first": "http://localhost:8201/api/tools?page=1",
    "last": "http://localhost:8201/api/tools?page=5",
    "prev": null,
    "next": "http://localhost:8201/api/tools?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 15,
    "to": 15,
    "total": 75
  }
}
```

#### Get Single Tool

```http
GET /api/tools/{id}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "ChatGPT",
    "slug": "chatgpt",
    "description": "Conversational AI assistant",
    "url": "https://chat.openai.com",
    "documentation_url": "https://platform.openai.com/docs",
    "how_to_use": "Visit the website and start chatting...",
    "examples": "Example use cases...",
    "logo_url": "https://example.com/logo.png",
    "images": [],
    "category": {
      "id": 1,
      "name": "Code Assistants"
    },
    "creator": {
      "id": 1,
      "name": "John Doe"
    },
    "tags": [
      {
        "id": 1,
        "name": "Free",
        "color": "#22c55e"
      }
    ],
    "recommendations": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great tool!",
        "user": {
          "id": 2,
          "name": "Jane Smith"
        },
        "created_at": "2026-01-21T12:00:00.000000Z"
      }
    ],
    "views_count": 150,
    "average_rating": 4.5,
    "created_at": "2026-01-21T12:00:00.000000Z",
    "updated_at": "2026-01-21T12:00:00.000000Z"
  }
}
```

---

## 🔐 Protected Endpoints (Authentication Required)

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer {token}
```

### User

#### Get Current User

```http
GET /api/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 1,
      "name": "developer",
      "display_name": "Developer"
    }
  }
}
```

#### Logout

```http
POST /api/logout
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### AI Tools (Authenticated Actions)

#### Create Tool

```http
POST /api/tools
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New AI Tool",
  "description": "A powerful AI tool for...",
  "url": "https://example.com",
  "documentation_url": "https://example.com/docs",
  "how_to_use": "Step by step instructions...",
  "examples": "Example scenarios...",
  "logo_url": "https://example.com/logo.png",
  "category_id": 1,
  "tag_ids": [1, 2],
  "suitable_for_roles": [1, 2, 3]
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 10,
    "name": "New AI Tool",
    "slug": "new-ai-tool",
    "description": "A powerful AI tool for...",
    "status": "active",
    "created_at": "2026-01-21T12:00:00.000000Z"
  },
  "message": "Tool created successfully"
}
```

**Validation Errors (422):**
```json
{
  "message": "The name field is required.",
  "errors": {
    "name": ["The name field is required."],
    "category_id": ["The category id field is required."]
  }
}
```

#### Update Tool

```http
PUT /api/tools/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (same as Create)

**Response (200 OK):**
```json
{
  "data": {
    "id": 10,
    "name": "Updated Tool Name",
    "slug": "updated-tool-name",
    "updated_at": "2026-01-21T12:30:00.000000Z"
  },
  "message": "Tool updated successfully"
}
```

**Authorization Error (403):**
```json
{
  "message": "You don't have permission to update this tool"
}
```

#### Delete Tool

```http
DELETE /api/tools/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Tool deleted successfully"
}
```

**Authorization Error (403):**
```json
{
  "message": "You don't have permission to delete this tool"
}
```

---

### Recommendations

#### Create Recommendation

```http
POST /api/recommendations
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "tool_id": 1,
  "rating": 5,
  "comment": "This tool is amazing! Highly recommend."
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 15,
    "tool_id": 1,
    "user_id": 1,
    "rating": 5,
    "comment": "This tool is amazing!",
    "created_at": "2026-01-21T12:00:00.000000Z"
  },
  "message": "Recommendation created successfully"
}
```

#### Update Recommendation

```http
PUT /api/recommendations/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated my review..."
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 15,
    "rating": 4,
    "comment": "Updated my review...",
    "updated_at": "2026-01-21T12:30:00.000000Z"
  },
  "message": "Recommendation updated successfully"
}
```

#### Delete Recommendation

```http
DELETE /api/recommendations/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Recommendation deleted successfully"
}
```

---

## 🚫 Error Responses

### 401 Unauthorized

```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden

```json
{
  "message": "You don't have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 422 Validation Error

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Error message 1",
      "Error message 2"
    ]
  }
}
```

### 500 Server Error

```json
{
  "message": "Server Error",
  "error": "Detailed error message (only in debug mode)"
}
```

---

## 📊 Rate Limiting

- **Public endpoints**: 60 requests per minute
- **Authenticated endpoints**: 120 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
```

---

## 🔒 Permissions

### Tool Management

- **Create**: Any authenticated user
- **Update**: Tool creator or Owner role
- **Delete**: Tool creator or Owner role

### Recommendation Management

- **Create**: Any authenticated user (one per tool)
- **Update**: Recommendation author only
- **Delete**: Recommendation author only

---

## 📝 Notes

- All timestamps are in UTC
- All date fields follow ISO 8601 format
- Pagination uses Laravel's default pagination format
- File uploads (logo, images) support: JPG, PNG, GIF (max 2MB)

---

**API Version**: 1.0
**Last Updated**: January 2026
