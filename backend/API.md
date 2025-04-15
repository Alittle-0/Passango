# PassanGo API Documentation

PassanGo is a musical creativity platform that helps musicians explore, create, and enhance their music through innovative chord and tab detection.

## Authentication

### Register User
```http
POST /api/auth/register
```
Request body:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "instrument": "guitar", // Optional: primary instrument
    "skillLevel": "intermediate" // Optional: beginner, intermediate, advanced
}
```

### Login User
```http
POST /api/auth/login
```
Request body:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

## Music Sheets

### Get All Music Sheets
```http
GET /api/music-sheets
```
Query parameters:
- `instrument`: Filter by instrument (guitar, piano, etc.)
- `difficulty`: Filter by difficulty level
- `genre`: Filter by music genre
- `sort`: Sort by (popular, newest, oldest)
- `page`: Page number
- `limit`: Items per page

### Get Single Music Sheet
```http
GET /api/music-sheets/:id
```

### Create Music Sheet
```http
POST /api/music-sheets
```
Headers:
- `Authorization`: Bearer token
- `Content-Type`: multipart/form-data

Request body:
```json
{
    "title": "Song Title",
    "artist": "Artist Name",
    "instrument": "guitar",
    "difficulty": "intermediate",
    "genre": "rock",
    "chords": ["C", "G", "Am", "F"],
    "tabs": "e|-----0-----0-----0-----0-----|\nB|-----1-----1-----1-----1-----|\nG|-----0-----0-----0-----0-----|\nD|-----2-----2-----2-----2-----|\nA|-----3-----3-----3-----3-----|\nE|-----x-----x-----x-----x-----|",
    "description": "Description of the song and playing tips"
}
```

### Update Music Sheet
```http
PUT /api/music-sheets/:id
```
Headers:
- `Authorization`: Bearer token
- `Content-Type`: multipart/form-data

### Delete Music Sheet
```http
DELETE /api/music-sheets/:id
```
Headers:
- `Authorization`: Bearer token

### Add Review
```http
POST /api/music-sheets/:id/reviews
```
Headers:
- `Authorization`: Bearer token

Request body:
```json
{
    "rating": 5,
    "comment": "Great arrangement!",
    "difficultyAccuracy": 4,
    "tabAccuracy": 5
}
```

## Chord Detection

### Detect Chords from Audio
```http
POST /api/chord-detection
```
Headers:
- `Authorization`: Bearer token
- `Content-Type`: multipart/form-data

Request body:
- `audioFile`: Audio file (mp3, wav)
- `instrument`: Instrument type
- `tuning`: Optional tuning information

Response:
```json
{
    "success": true,
    "data": {
        "chords": ["C", "G", "Am", "F"],
        "timestamps": [0, 2.5, 5, 7.5],
        "confidence": [0.95, 0.92, 0.88, 0.94]
    }
}
```

### Convert Chords to Tabs
```http
POST /api/chord-to-tab
```
Headers:
- `Authorization`: Bearer token

Request body:
```json
{
    "chords": ["C", "G", "Am", "F"],
    "instrument": "guitar",
    "tuning": "standard"
}
```

## User Collections

### Create Collection
```http
POST /api/collections
```
Headers:
- `Authorization`: Bearer token

Request body:
```json
{
    "name": "My Favorite Songs",
    "description": "Collection of my favorite songs to play",
    "isPublic": true
}
```

### Add to Collection
```http
POST /api/collections/:collectionId/add
```
Headers:
- `Authorization`: Bearer token

Request body:
```json
{
    "musicSheetId": "sheetId"
}
```

## Response Format

All responses follow this format:
```json
{
    "success": true,
    "data": {
        // Response data
    }
}
```

Error responses:
```json
{
    "success": false,
    "error": "Error message"
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Codes

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 