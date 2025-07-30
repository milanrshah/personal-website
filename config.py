import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load production environment file if FLASK_ENV is production
if os.getenv('FLASK_ENV') == 'production':
    load_dotenv('.env.production')

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
    config_class = config_dict.get(config_dict[env], config_dict['default'])
    return config_class() 