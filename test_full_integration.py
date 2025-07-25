#!/usr/bin/env python3
"""
Full Integration Test Script for Comments System
Tests both Flask backend and React frontend integration
"""

import requests
import json
import time
import webbrowser
from datetime import datetime

# Configuration
FLASK_URL = "http://localhost:5001"
REACT_URL = "http://localhost:3000"

def test_backend_health():
    """Test Flask backend health"""
    print("🔍 Testing Flask Backend Health...")
    try:
        response = requests.get(f"{FLASK_URL}/")
        if response.status_code == 200:
            print("✅ Flask backend is running")
            return True
        else:
            print(f"❌ Flask backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Flask backend connection failed: {e}")
        return False

def test_react_frontend():
    """Test React frontend accessibility"""
    print("🔍 Testing React Frontend...")
    try:
        response = requests.get(f"{REACT_URL}/")
        if response.status_code == 200:
            print("✅ React frontend is running")
            return True
        else:
            print(f"❌ React frontend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ React frontend connection failed: {e}")
        return False

def test_comments_api():
    """Test comments API endpoints"""
    print("🔍 Testing Comments API...")
    
    # Test public comments endpoint
    try:
        response = requests.get(f"{FLASK_URL}/api/comments/2024-01")
        if response.status_code == 200:
            print("✅ Public comments endpoint working")
        else:
            print(f"❌ Public comments endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Public comments endpoint error: {e}")
        return False
    
    # Test authentication required endpoints
    try:
        response = requests.post(f"{FLASK_URL}/api/comments", 
                               json={"week": "2024-01", "commentText": "Test"})
        if response.status_code == 401:
            print("✅ Authentication protection working")
        else:
            print(f"❌ Authentication protection failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Authentication test error: {e}")
        return False
    
    return True

def test_cors_configuration():
    """Test CORS configuration"""
    print("🔍 Testing CORS Configuration...")
    try:
        headers = {
            'Origin': REACT_URL,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{FLASK_URL}/api/comments/2024-01", headers=headers)
        
        if response.status_code == 200:
            cors_headers = response.headers
            if 'Access-Control-Allow-Origin' in cors_headers:
                print("✅ CORS configuration working")
                return True
            else:
                print("❌ CORS headers missing")
                return False
        else:
            print(f"❌ CORS preflight failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ CORS test error: {e}")
        return False

def test_dynamodb_connection():
    """Test DynamoDB connection"""
    print("🔍 Testing DynamoDB Connection...")
    try:
        import boto3
        from dotenv import load_dotenv
        import os
        
        load_dotenv()
        
        dynamodb = boto3.resource('dynamodb',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        
        table_name = os.getenv('DYNAMODB_TABLE_NAME', 'nfl-qb-comments')
        table = dynamodb.Table(table_name)
        
        # Check table status
        status = table.table_status
        if status == 'ACTIVE':
            print(f"✅ DynamoDB table '{table_name}' is active")
            return True
        else:
            print(f"❌ DynamoDB table status: {status}")
            return False
    except Exception as e:
        print(f"❌ DynamoDB connection failed: {e}")
        return False

def open_browser_for_manual_testing():
    """Open browser for manual testing"""
    print("🌐 Opening browser for manual testing...")
    try:
        webbrowser.open(f"{REACT_URL}/blog/qb-rankings")
        print("✅ Browser opened for manual testing")
        print(f"📝 Test URL: {REACT_URL}/blog/qb-rankings")
        return True
    except Exception as e:
        print(f"❌ Failed to open browser: {e}")
        return False

def main():
    print("🚀 Starting Full Integration Tests")
    print("=" * 60)
    print(f"Flask Backend: {FLASK_URL}")
    print(f"React Frontend: {REACT_URL}")
    print("=" * 60)
    
    tests = [
        ("Flask Backend Health", test_backend_health),
        ("React Frontend", test_react_frontend),
        ("Comments API", test_comments_api),
        ("CORS Configuration", test_cors_configuration),
        ("DynamoDB Connection", test_dynamodb_connection),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 40)
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} failed")
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"🎉 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All tests passed! Integration is working correctly.")
        print("\n🔧 Next Steps:")
        print("1. Set up Google OAuth credentials")
        print("2. Update REACT_APP_GOOGLE_CLIENT_ID in frontend/.env")
        print("3. Test Google Sign-in functionality")
        print("4. Create and manage comments")
        
        # Open browser for manual testing
        open_browser_for_manual_testing()
    else:
        print("❌ Some tests failed. Please check the errors above.")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Flask backend is running on port 5001")
        print("2. Make sure React frontend is running on port 3000")
        print("3. Check your .env file configuration")
        print("4. Verify AWS credentials and DynamoDB table")

if __name__ == "__main__":
    main() 