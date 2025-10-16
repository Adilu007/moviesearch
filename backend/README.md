# Movie Search Save App - Backend

A RESTful API built with Node.js, Express, and MongoDB for the Movie Search Save application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OMDb API key (get free key from [OMDb API](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` file and add your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movie-search-app
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   OMDB_API_KEY=your_omdb_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   - **Local MongoDB**: `mongod`
   - **MongoDB Atlas**: Use your Atlas connection string in `MONGODB_URI`

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   Visit `http://localhost:5000/health` to check if the server is running.

## 📋 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Movie Endpoints (Protected - Require JWT Token)

#### Search Movies
```http
GET /api/movies/search?title=batman
Authorization: Bearer <your_jwt_token>
```

#### Save Movie
```http
POST /api/movies/save
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Batman Begins",
  "year": "2005",
  "poster": "https://...",
  "imdbID": "tt0372784"
}
```

#### Get Saved Movies
```http
GET /api/movies/list
Authorization: Bearer <your_jwt_token>
```

#### Remove Saved Movie (Bonus Feature)
```http
DELETE /api/movies/remove/tt0372784
Authorization: Bearer <your_jwt_token>
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment | No | `development` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/movie-search-app` |
| `JWT_SECRET` | JWT signing secret | Yes | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `7d` |
| `OMDB_API_KEY` | OMDb API key | Yes | `your_omdb_key` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:5173` |

### Getting OMDb API Key

1. Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Choose the FREE plan (1,000 daily requests)
3. Enter your email and verify
4. Copy the API key to your `.env` file

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js          # User schema and methods
│   │   └── Movie.js         # Movie schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── movies.js        # Movie management routes
│   └── middleware/
│       └── auth.js          # JWT authentication middleware
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── .env.example             # Environment template
├── .env                     # Environment variables (create this)
└── .gitignore              # Git ignore rules
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get JWT token from auth endpoints
2. **Protected Routes**: Include token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Expiry**: Default 7 days (configurable via `JWT_EXPIRES_IN`)

## 🛠️ Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

## 🗃️ Database Schema

### User Model
```javascript
{
  email: String,           // Unique, validated email
  password: String,        // Hashed with bcrypt
  savedMovies: [ObjectId], // References to saved movies
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  title: String,           // Movie title
  year: String,           // Release year
  poster: String,         // Poster URL (nullable)
  imdbID: String,         // Unique IMDb identifier
  savedBy: [ObjectId],    // Users who saved this movie
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing

You can test the API using tools like:
- **Postman**: Import the endpoints and test manually
- **curl**: Command-line testing
- **Frontend**: Use with the React frontend

### Example curl commands:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Search movies (replace TOKEN with actual JWT)
curl -X GET "http://localhost:5000/api/movies/search?title=batman" \
  -H "Authorization: Bearer TOKEN"
```

## 🔧 Development

### Database Setup

**Option 1: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB: `mongod`
3. Use connection string: `mongodb://localhost:27017/movie-search-app`

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and add to `.env`

### Code Style
- ES6 modules (`import/export`)
- Async/await for promises
- Consistent error handling
- Input validation
- Security best practices

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production MongoDB URI
4. Set appropriate `FRONTEND_URL`

### Recommended Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Simple Node.js deployment
- **DigitalOcean**: VPS with full control
- **AWS/Google Cloud**: Enterprise solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter issues:

1. **Check MongoDB connection**: Ensure MongoDB is running
2. **Verify API keys**: Confirm OMDb API key is valid
3. **Check logs**: Server logs show detailed error information
4. **Environment**: Ensure all required environment variables are set

## 📄 License

This project is licensed under the ISC License.