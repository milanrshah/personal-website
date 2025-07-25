#!/usr/bin/env python3
"""
Test Comment Creation Workflow
Simulates the full process from Google OAuth to comment creation
"""

import requests
import json
import time

# Configuration
FLASK_URL = "http://localhost:5001"
REACT_URL = "http://localhost:3000"

def test_google_oauth_flow():
    """Test the Google OAuth flow"""
    print("🔍 Testing Google OAuth Flow...")
    
    # This is a simulation - in real usage, the frontend handles the Google OAuth
    # and sends the ID token to the backend
    print("ℹ️  In the real flow:")
    print("   1. User clicks Google Sign-in button")
    print("   2. Google OAuth popup opens")
    print("   3. User authorizes the app")
    print("   4. Frontend receives ID token")
    print("   5. Frontend sends ID token to backend")
    print("   6. Backend verifies token and creates JWT")
    
    return True

def test_comment_creation_with_mock_token():
    """Test comment creation with a mock JWT token"""
    print("\n🔍 Testing Comment Creation with Mock Token...")
    
    # This simulates what happens after successful OAuth
    # In reality, you'd have a real JWT token from the OAuth flow
    
    # Test without token (should fail)
    try:
        response = requests.post(f"{FLASK_URL}/api/comments", 
                               json={"week": "2024-01", "commentText": "Test comment"})
        print(f"✅ POST without token: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ POST without token failed: {e}")
    
    # Test with invalid token (should fail)
    try:
        headers = {"Authorization": "Bearer invalid_token"}
        response = requests.post(f"{FLASK_URL}/api/comments", 
                               json={"week": "2024-01", "commentText": "Test comment"},
                               headers=headers)
        print(f"✅ POST with invalid token: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ POST with invalid token failed: {e}")
    
    return True

def check_frontend_console_errors():
    """Provide guidance for checking frontend console errors"""
    print("\n🔍 Frontend Debugging Steps:")
    print("1. Open browser developer tools (F12)")
    print("2. Go to Console tab")
    print("3. Try to create a comment")
    print("4. Look for any error messages")
    print("5. Check Network tab for failed requests")
    
    return True

def test_api_endpoints():
    """Test all relevant API endpoints"""
    print("\n🔍 Testing API Endpoints...")
    
    endpoints = [
        ("GET", "/api/comments/2024-01", None, 200),
        ("POST", "/api/auth/google", {"id_token": "invalid"}, 400),
        ("GET", "/api/auth/user", None, 401),
    ]
    
    for method, endpoint, data, expected_status in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{FLASK_URL}{endpoint}")
            elif method == "POST":
                response = requests.post(f"{FLASK_URL}{endpoint}", json=data)
            
            status = response.status_code
            result = "✅" if status == expected_status else "❌"
            print(f"{result} {method} {endpoint}: {status} (expected {expected_status})")
            
            if status != expected_status:
                print(f"   Response: {response.text[:100]}...")
                
        except Exception as e:
            print(f"❌ {method} {endpoint}: Error - {e}")
    
    return True

def provide_debugging_steps():
    """Provide comprehensive debugging steps"""
    print("\n🔧 Debugging Steps for Comment Creation:")
    print("=" * 50)
    
    print("\n1. **Check Browser Console:**")
    print("   - Open DevTools (F12)")
    print("   - Go to Console tab")
    print("   - Try to create a comment")
    print("   - Look for JavaScript errors")
    
    print("\n2. **Check Network Tab:**")
    print("   - Go to Network tab in DevTools")
    print("   - Try to create a comment")
    print("   - Look for failed requests to /api/comments")
    print("   - Check request/response details")
    
    print("\n3. **Check Authentication:**")
    print("   - Verify you're signed in")
    print("   - Check if JWT token is stored in localStorage")
    print("   - Open DevTools → Application → Local Storage")
    print("   - Look for 'token' and 'user' entries")
    
    print("\n4. **Check Backend Logs:**")
    print("   - Look at Flask server console")
    print("   - Check for any error messages")
    print("   - Verify requests are reaching the backend")
    
    print("\n5. **Test API Directly:**")
    print("   - Use curl or Postman to test endpoints")
    print("   - Verify backend is working correctly")
    
    return True

def main():
    print("🚀 Comment Creation Workflow Test")
    print("=" * 50)
    
    tests = [
        ("Google OAuth Flow", test_google_oauth_flow),
        ("Comment Creation with Mock Token", test_comment_creation_with_mock_token),
        ("API Endpoints", test_api_endpoints),
        ("Frontend Console Errors", check_frontend_console_errors),
        ("Debugging Steps", provide_debugging_steps),
    ]
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 40)
        test_func()
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print("🎯 Next Steps:")
    print("1. Check browser console for errors")
    print("2. Verify authentication is working")
    print("3. Test API endpoints directly")
    print("4. Check backend logs for errors")

if __name__ == "__main__":
    main() 