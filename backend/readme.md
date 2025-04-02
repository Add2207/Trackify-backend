
Trackify/
│── backend/
│   ├── config/
│   │   ├── db.js                 # Database connection setup
│   ├── routes/
│   │   ├── authRoutes.js         # Handles Spotify authentication
│   │   ├── apiRoutes.js          # Fetch user data from Spotify
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main Express backend server
│   ├── package.json              # Backend dependencies
│── frontend/
│   ├── index.html                # Main frontend page
│   ├── client.js                 # Updated Spotify login logic
│   ├── styles.css                # CSS styling
│   ├── package.json              # (If using frontend dependencies)
│── .gitignore                     # Ignore node_modules and .env

cd backend
npm init -y
npm install express cors axios dotenv express-session pg
