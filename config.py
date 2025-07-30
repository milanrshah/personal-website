import os
from dotenv import load_dotenv

# Debug: Print what environment we're in
print(f"FLASK_ENV detected: '{os.getenv('FLASK_ENV')}'")

# Set FLASK_ENV if not already set (for production)
if not os.getenv('FLASK_ENV'):
    os.environ['FLASK_ENV'] = 'production'
    print(f"Setting FLASK_ENV to production")

# Load production environment file if FLASK_ENV is production
if os.getenv('FLASK_ENV') == 'production':
    load_dotenv('.env.production')
    print(f"Loading production environment from .env.production")
    print(f"DB_PASSWORD from env: '{os.getenv('DB_PASSWORD')}'")
else:
    load_dotenv()
    print(f"Loading development environment from .env")

class Config:
    """Base configuration class"""
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'default-secret-key-change-this')
    DEBUG = False
    TESTING = False
    
    # Database configuration
    DB_HOST = os.getenv('DB_HOST', 'personal-website-db.cb002k6es5bn.us-east-2.rds.amazonaws.com')
    DB_NAME = os.getenv('DB_NAME', 'personal_website')
    DB_USER = os.getenv('DB_USER', 'admin')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    
    # Debug output
    print(f"All DB env vars: DB_HOST: '{DB_HOST}', DB_NAME: '{DB_NAME}', DB_USER: '{DB_USER}', DB_PASSWORD: '{DB_PASSWORD}', DB_PORT: '{DB_PORT}'")
    
    # AWS configuration
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
    DYNAMODB_TABLE_NAME = os.getenv('DYNAMODB_TABLE_NAME', 'nfl-qb-comments')
    
    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    
    # CORS origins
    CORS_ORIGINS = ['http://localhost:3000']
    
    @property
    def DATABASE_CONFIG(self):
        return {
            'host': self.DB_HOST,
            'database': self.DB_NAME,
            'user': self.DB_USER,
            'password': self.DB_PASSWORD,
            'port': self.DB_PORT
        }

class DevelopmentConfig(Config):
    """Development configuration - matches current setup"""
    DEBUG = True
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        '*'  # Allow all origins for development
    ]

class ProductionConfig(Config):
    """Production configuration - secure settings"""
    DEBUG = False
    CORS_ORIGINS = [
        'http://localhost:3000',  # For local testing
        'https://*.amplifyapp.com',  # For Amplify default domain
        'https://your-custom-domain.com'  # Replace with your custom domain if you have one
    ]

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    CORS_ORIGINS = ['http://localhost:3000']

# Configuration dictionary
config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    config_class = config_dict.get(env, config_dict['default'])
    return config_class() 