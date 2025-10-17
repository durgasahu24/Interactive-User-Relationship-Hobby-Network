Here's a ready-to-use README.md for your cybernauts collection:

---

# cybernauts Postman Collection

## Purpose
Manage users and their relationships, with Redis caching for performance.  
Base URL: `http://localhost:8000/api/v1`

## Endpoints

| Name        | Method | URL                        | Description                     |
|-------------|--------|----------------------------|---------------------------------|
| testRedis   | GET    | /test-redis                | Test Redis connectivity         |
| createUser  | POST   | /users                     | Create a new user               |
| getUsers    | GET    | /users                     | Get all users                   |
| updateUser  | PUT    | /users/<userId>            | Update a user                   |
| deleteUser  | DELETE | /users/<userId>            | Delete a user                   |
| linkUser    | POST   | /users/<userId>/link       | Link two users as friends       |
| unlinkUser  | DELETE | /users/<userId>/unlink     | Remove friendship               |
| getGraph    | GET    | /users/graph               | Get user friendship graph       |

## Example Requests

### Create User
`POST /users`
```json
{
  "username": "Roshan",
  "age": 22,
  "hobbies": ["playing", "watching movies", "dancing"]
}
```
**Response**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": { "user": { "_id": "68f207d5a293a9dde2cb739b", "username": "Roshan" } }
}
```

### Get Users
`GET /users`
**Response**
```json
{
  "status": "success",
  "message": "Users fetched successfully",
  "source": "cache",
  "data": { "users": [ { "_id": "68f207d5a293a9dde2cb739b", "username": "Roshan" } ] }
}
```

### Update User
`PUT /users/<userId>`
Body:
```json
{ "username": "Roshan Updated", "age": 23 }
```

### Delete User
`DELETE /users/<userId>`

### Link Users
`POST /users/<userId>/link`
Body:
```json
{ "friendId": "<friendUserId>" }
```

### Unlink Users
`DELETE /users/<userId>/unlink`
Body:
```json
{ "friendId": "<friendUserId>" }
```

### Get Graph
`GET /users/graph`
Returns user nodes and edges.

## Notes

- Run backend at `http://localhost:8000`.
- Redis is optional; MongoDB is fallback.
- Replace `<userId>` with real IDs.
- Use `nodemon` or `ts-node-dev` for development.
- POST/PUT require `Content-Type: application/json`.

---


