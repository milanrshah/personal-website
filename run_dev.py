#!/usr/bin/env python3
"""
Development server startup script
"""
import os
import sys
from dotenv import load_dotenv

# Load development environment
load_dotenv('.env.development')

# Set environment
os.environ['FLASK_ENV'] = 'development'

# Import and run the app
from app import app

if __name__ == '__main__':
    print("🚀 Starting Flask Development Server...")
    print(f"🔧 Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"🌐 Debug Mode: {app.config['DEBUG']}")
    print(f"🔗 CORS Origins: {app.config['CORS_ORIGINS']}")
    print("📝 Server will be available at: http://localhost:5001")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5001,
        use_reloader=True
    ) 