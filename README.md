# Node.js REST API Project

A RESTful API built with Node.js, Express, and MongoDB for user authentication and post management.

## Features
- User Authentication (Login/Register)
- JWT-based Authentication
- User Status Management
- Post Creation and Retrieval
- File Upload Support

## Prerequisites
- Node.js (Latest LTS version)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn
- socket.io-client (for WebSocket functionality)

## Setup Instructions

1. Clone the repository
2. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
JWT_SECRET=your-secret-key
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

The server will start in development mode with nodemon.

## Dependencies

```json
{
  "bcryptjs": "^3.0.2",
  "body-parser": "^2.2.0",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "express-validator": "^7.2.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.14.3",
  "multer": "^1.4.5-lts.2",
  "socket.io": "^4.7.4"
}
```

## API Endpoints

### REST API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/status` - Get user status (requires authentication)
- `PUT /api/auth/status` - Update user status (requires authentication)
- `GET /api/posts` - Get all posts (requires authentication)
- `POST /api/post` - Create a new post (requires authentication)

### WebSocket Events

#### Available Events
- `connection` - Client connects to WebSocket server
- `posts` - Real-time post updates
- `disconnect` - Client disconnects from server

#### Post Update Events
The `posts` event can have the following actions:
- `create` - New post created
- `update` - Post updated
- `delete` - Post deleted

Example event payload:
```javascript
{
    action: 'create', // or 'update' or 'delete'
    post: {
        _id: 'post-id',
        title: 'Post Title',
        content: 'Post Content',
        imageUrl: 'path/to/image',
        creator: {
            _id: 'user-id',
            name: 'User Name'
        }
    }
}
```

#### Client-Side Implementation
To use WebSocket functionality in your client application:

1. Install socket.io-client:
```bash
npm install socket.io-client
```

2. Initialize WebSocket connection:
```javascript
// Import socket.io-client
import io from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:8080');

// Handle connection
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

// Listen for post updates
socket.on('posts', (data) => {
    switch (data.action) {
        case 'create':
            console.log('New post created:', data.post);
            // Update your UI with the new post
            break;
        case 'update':
            console.log('Post updated:', data.post);
            // Update your UI with the modified post
            break;
        case 'delete':
            console.log('Post deleted:', data.post);
            // Remove the post from your UI
            break;
    }
});

#### Best Practices
- Always handle connection errors and reconnection logic
- Implement proper authentication for WebSocket connections
- Use rooms to organize different types of real-time communication
- Handle message history and persistence as needed
- Implement proper error handling for WebSocket events

#### Security Notes
- WebSocket connections are secured using CORS configuration
- Ensure proper authentication before joining rooms
- Implement rate limiting for WebSocket events
- Use secure WebSocket (wss) in production environments

### Error Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Environment variables for sensitive data
- WebSocket CORS configuration for secure cross-origin connections

## Development

The project uses nodemon for development, which automatically restarts the server when changes are made.

## License

ISC License

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
