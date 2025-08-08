# API Examples

This file contains example requests for testing the API endpoints.

## Base URL
```
http://localhost:3000/api
```

## Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

## Bar Games

### Create a Bar Game
```bash
curl -X POST http://localhost:3000/api/bar-games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pool Table",
    "description": "Standard 8-ball pool table",
    "pricePerHour": 15.00,
    "available": true
  }'
```

### Get All Bar Games
```bash
curl -X GET http://localhost:3000/api/bar-games
```

### Check In to Game
```bash
curl -X POST http://localhost:3000/api/bar-games/{gameId}/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{customerId}"
  }'
```

### Check Out of Game Session
```bash
curl -X PUT http://localhost:3000/api/bar-games/game-sessions/{sessionId}/check-out
```

## Cafe Items

### Create a Cafe Item
```bash
curl -X POST http://localhost:3000/api/cafe-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Espresso",
    "description": "Single shot espresso",
    "price": 3.50,
    "category": "Coffee",
    "quantity": 100,
    "inStock": true
  }'
```

### Get Low Stock Items
```bash
curl -X GET http://localhost:3000/api/cafe-items/low-stock
```

### Get Items by Category
```bash
curl -X GET http://localhost:3000/api/cafe-items/category/Coffee
```

## Customers

### Create a Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

### Search Customers
```bash
curl -X GET "http://localhost:3000/api/customers/search?query=john"
```

### Assign Membership
```bash
curl -X PUT http://localhost:3000/api/customers/{customerId}/assign-membership \
  -H "Content-Type: application/json" \
  -d '{
    "membershipId": "{membershipId}"
  }'
```

## Memberships

### Create a Membership
```bash
curl -X POST http://localhost:3000/api/memberships \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Membership",
    "description": "Premium membership with exclusive benefits",
    "duration": 30,
    "price": 99.99,
    "active": true
  }'
```

## Orders

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{customerId}",
    "items": [
      {
        "itemId": "{cafeItemId}",
        "itemType": "CafeItem",
        "quantity": 2
      },
      {
        "itemId": "{gameSessionId}",
        "itemType": "GameSession",
        "quantity": 1
      }
    ]
  }'
```

### Pay for Order
```bash
curl -X POST http://localhost:3000/api/orders/{orderId}/pay
```

### Add Items to Order
```bash
curl -X POST http://localhost:3000/api/orders/{orderId}/items \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": "{cafeItemId}",
        "itemType": "CafeItem",
        "quantity": 1
      }
    ]
  }'
```

## Complete Workflow Example

1. **Create a Bar Game:**
```bash
curl -X POST http://localhost:3000/api/bar-games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dart Board",
    "description": "Electronic dart board",
    "pricePerHour": 10.00,
    "available": true
  }'
```

2. **Create a Customer:**
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "phone": "+1987654321"
  }'
```

3. **Create a Cafe Item:**
```bash
curl -X POST http://localhost:3000/api/cafe-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cappuccino",
    "description": "Espresso with steamed milk",
    "price": 4.50,
    "category": "Coffee",
    "quantity": 50,
    "inStock": true
  }'
```

4. **Check In to Game:**
```bash
curl -X POST http://localhost:3000/api/bar-games/{gameId}/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{customerId}"
  }'
```

5. **Create an Order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{customerId}",
    "items": [
      {
        "itemId": "{cafeItemId}",
        "itemType": "CafeItem",
        "quantity": 1
      }
    ]
  }'
```

6. **Pay for Order:**
```bash
curl -X POST http://localhost:3000/api/orders/{orderId}/pay
```

7. **Check Out of Game:**
```bash
curl -X PUT http://localhost:3000/api/bar-games/game-sessions/{sessionId}/check-out
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pool Table",
    "pricePerHour": 15,
    "available": true,
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Bar game not found"
}
```

### Validation Error Response
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```
