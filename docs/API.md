# Project X — API Reference

**Base URL:** `http://localhost:3000/api/v1`  
**Interactive docs (Swagger UI):** `http://localhost:3000/api`

---

## Authentication

All endpoints (except `POST /auth/login`) require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

---

## Auth

### POST `/auth/login`

Login with a Firebase ID token. No authentication required.

**Rate limit:** 10 requests / 60 s per IP.

**Request body:**

```json
{ "idToken": "firebase_id_token_string" }
```

**Response `200`:**

```json
{
  "accessToken": "eyJhbGci...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["admin"],
    "permissions": ["products.read", "products.create"]
  }
}
```

| Status | Description |
|--------|-------------|
| `200` | Login successful |
| `400` | Missing or malformed body |
| `401` | Invalid or expired Firebase token |
| `429` | Too many requests |

---

## Dashboard

### GET `/dashboard/summary`

Returns inventory metrics for the dashboard.

**Response `200`:**

```json
{
  "metrics": {
    "totalProducts": 42,
    "totalBrands": 12,
    "totalCategories": 8,
    "totalBundles": 15,
    "totalSlabs": 150
  }
}
```

---

## Products

### GET `/products`

Paginated list of products with optional filters.

**Query params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | number | No | Page number, 1-based (default `1`) |
| `limit` | number | No | Items per page, max 100 (default `10`) |
| `search` | string | No | Search in name and description |
| `brandId` | UUID | No | Filter by brand |
| `categoryId` | UUID | No | Filter by category |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Calacatta Gold",
      "description": "Premium marble",
      "isActive": true,
      "brand": { "id": "uuid", "name": "Versace" },
      "category": { "id": "uuid", "name": "Marble" },
      "levelId": "uuid",
      "finishId": "uuid",
      "createdBy": "user-uuid",
      "updatedBy": "user-uuid",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### GET `/products/:id`

Get a single product by ID.

**Response `200`:** Single product object (same shape as items in `data` above).

| Status | Description |
|--------|-------------|
| `404` | Product not found |

### POST `/products`

Create a new product.

**Request body:**

```json
{
  "name": "Calacatta Gold",
  "categoryId": "uuid",
  "levelId": "uuid",
  "finishId": "uuid",
  "description": "Optional description",
  "brandId": "uuid (optional)"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique product name |
| `categoryId` | Yes | Category UUID |
| `levelId` | Yes | Level UUID |
| `finishId` | Yes | Finish UUID |
| `description` | No | Free text description |
| `brandId` | No | Brand UUID |

| Status | Description |
|--------|-------------|
| `201` | Product created |
| `400` | Invalid input or duplicate name |
| `403` | Missing permission `products.create` |

### PATCH `/products/:id`

Update an existing product. All fields are optional.

**Request body:**

```json
{
  "name": "New name",
  "description": "New description",
  "brandId": "uuid or null to clear",
  "categoryId": "uuid",
  "levelId": "uuid",
  "finishId": "uuid",
  "isActive": true
}
```

**Response `200`:**

```json
{ "statusCode": 200, "message": "Product with id <id> updated successfully" }
```

| Status | Description |
|--------|-------------|
| `404` | Product, brand, category, level or finish not found |
| `409` | Name already taken by another product |

---

## Brands

### GET `/brands`

List all brands (admin view).

**Response `200`:** Array of brand objects.

```json
[
  {
    "id": "uuid",
    "name": "Versace",
    "description": "Italian luxury brand",
    "isActive": true,
    "createdBy": "user-uuid",
    "updatedBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/brands/active`

List only active brands. **Use this for select dropdowns in forms.**

**Response `200`:** Same structure as `GET /brands`, only `isActive: true` items, sorted A-Z.

### POST `/brands`

Create a new brand.

**Request body:**

```json
{
  "name": "Versace",
  "description": "Optional description"
}
```

| Status | Description |
|--------|-------------|
| `201` | Brand created |
| `409` | Brand name already exists |

### PATCH `/brands/:id`

Update a brand.

**Request body:**

```json
{
  "name": "New name",
  "description": "New description"
}
```

**Response `200`:**

```json
{ "statusCode": 200, "message": "Brand with id <id> updated successfully" }
```

---

## Categories

### GET `/categories`

List all categories.

**Response `200`:** Array of category objects.

```json
[
  {
    "id": "uuid",
    "name": "Marble",
    "abbreviation": "MRB",
    "isActive": true,
    "createdBy": "user-uuid",
    "updatedBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/categories/active`

List only active categories. **Use this for select dropdowns in forms.**

**Response `200`:** Same structure, only `isActive: true` items, sorted A-Z.

### POST `/categories`

Create a new category.

**Request body:**

```json
{
  "name": "Marble",
  "description": "Optional description"
}
```

### PATCH `/categories/:id`

Update a category.

**Request body:**

```json
{
  "name": "New name",
  "description": "New description"
}
```

**Response `200`:**

```json
{ "statusCode": 200, "message": "Category with id <id> updated successfully" }
```

---

## Levels

### GET `/levels`

List all levels (ordered by `sortOrder`).

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "name": "Premium",
    "sortOrder": 1,
    "description": "Top-tier quality",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/levels/active`

List only active levels ordered by `sortOrder`. **Use this for select dropdowns in forms.**

---

## Finishes

### GET `/finishes`

List all finishes.

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "name": "Polished",
    "abbreviation": "POL",
    "description": "Glossy polished surface",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/finishes/active`

List only active finishes. **Use this for select dropdowns in forms.**

---

## Suppliers

### GET `/suppliers`

List all suppliers.

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "name": "Stone & Co",
    "abbreviation": "STC",
    "isActive": true,
    "createdBy": "user-uuid",
    "updatedBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/suppliers/active`

List only active suppliers. **Use this for select dropdowns in forms.**

---

## Bundles

### GET `/bundles`

Paginated list of bundles.

**Query params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | number | No | Page number, 1-based (default `1`) |
| `limit` | number | No | Items per page, max 100 (default `10`) |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "supplierId": "uuid",
      "lotNumber": "LOT-2024-001",
      "thicknessCm": 2.0,
      "createdBy": "user-uuid",
      "updatedBy": "user-uuid",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### POST `/bundles`

Create a new bundle.

**Request body:**

```json
{
  "productId": "uuid",
  "supplierId": "uuid",
  "lotNumber": "LOT-2024-001",
  "thicknessCm": 2.0
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `productId` | Yes | Product UUID |
| `supplierId` | Yes | Supplier UUID |
| `lotNumber` | No | Lot number string |
| `thicknessCm` | No | Thickness in centimeters (≥ 0) |

| Status | Description |
|--------|-------------|
| `201` | Bundle created |
| `404` | Product or supplier not found |

### PATCH `/bundles/:id`

Update a bundle.

**Request body:**

```json
{
  "lotNumber": "LOT-2024-002",
  "thicknessCm": 2.5
}
```

**Response `200`:**

```json
{ "statusCode": 200, "message": "Bundle with id <id> updated successfully" }
```

---

## Slabs

### GET `/slabs`

Paginated list of slabs, with optional filter by bundle.

**Query params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | number | No | Page number, 1-based (default `1`) |
| `limit` | number | No | Items per page, max 100 (default `10`) |
| `bundleId` | UUID | No | Filter slabs belonging to a specific bundle |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "bundleId": "uuid",
      "code": "SN-2024-001",
      "widthCm": 120.5,
      "heightCm": 240.0,
      "dimensions": "120.5x240",
      "status": "AVAILABLE",
      "description": "Optional description",
      "createdBy": "user-uuid",
      "updatedBy": "user-uuid",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 200,
  "page": 1,
  "limit": 10,
  "totalPages": 20
}
```

**Slab statuses:**

| Value | Description |
|-------|-------------|
| `AVAILABLE` | Ready for sale |
| `RESERVED` | Held for a customer |
| `SOLD` | Sold and no longer available |

### POST `/slabs`

Create a new slab.

**Request body:**

```json
{
  "bundleId": "uuid",
  "code": "SN-2024-001",
  "widthCm": 120.5,
  "heightCm": 240.0,
  "description": "Optional description"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `bundleId` | Yes | Bundle UUID |
| `code` | Yes | Unique slab code |
| `widthCm` | Yes | Width in centimeters (> 0) |
| `heightCm` | Yes | Height in centimeters (> 0) |
| `description` | No | Free text |

| Status | Description |
|--------|-------------|
| `201` | Slab created |
| `400` | Invalid dimensions or missing fields |

### PATCH `/slabs/:id`

Update slab status or description.

**Request body:**

```json
{
  "status": "RESERVED",
  "description": "Updated description"
}
```

**Response `200`:**

```json
{ "statusCode": 200, "message": "Slab with id <id> updated successfully" }
```

---

## Common Response Shapes

### Paginated result

All paginated endpoints return this envelope:

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Error responses

```json
{ "statusCode": 400, "message": "Validation failed", "error": "Bad Request" }
{ "statusCode": 401, "message": "Unauthorized" }
{ "statusCode": 403, "message": "Forbidden resource" }
{ "statusCode": 404, "message": "Product not found" }
{ "statusCode": 409, "message": "Name already exists" }
```

---

## Frontend Quick Reference — Form Selects

When rendering a "create product" form, populate dropdowns with these endpoints:

| Dropdown | Endpoint |
|----------|----------|
| Category | `GET /categories/active` |
| Level | `GET /levels/active` |
| Finish | `GET /finishes/active` |
| Brand (optional) | `GET /brands/active` |
| Supplier (for bundles) | `GET /suppliers/active` |
