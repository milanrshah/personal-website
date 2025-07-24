# QB Rankings Frontend

React frontend for the NFL QB Rankings application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000).

## Backend Setup

Make sure your Flask backend is running on port 5000:

```bash
# In the backend directory
pip install -r requirements.txt
python app.py
```

The React app is configured to proxy requests to `http://localhost:5000` for the Flask API.

## Features

- Modern React components with hooks
- Responsive design
- URL state management for sharing links
- Local storage for user preferences
- Real-time data fetching from Flask API
- Movement indicators for QB rankings
- Tab-based navigation for years and weeks

## Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   └── Navbar.css
├── pages/
│   ├── Home.js
│   ├── Home.css
│   ├── About.js
│   ├── About.css
│   ├── Blog.js
│   ├── Blog.css
│   ├── QBRankings.js
│   └── QBRankings.css
├── App.js
├── App.css
├── index.js
└── index.css
``` 