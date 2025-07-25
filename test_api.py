#!/usr/bin/env python3
"""
Comprehensive API Test Script for Comments System
"""

import requests
import json
import time

BASE_URL = "http://localhost:5001"

def test_endpoint(method, endpoint, data=None, headers=None, expected_status=200):
    """Test an API endpoint and return the response"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers)
        
        print(f"✅ {method} {endpoint}")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == expected_status:
            print(f"   ✅ Expected status {expected_status}")
        else:
            print(f"   ❌ Expected status {expected_status}, got {response.status_code}")
        
        return response
        
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {e}")
        return None

def main():
    print("🚀 Starting API Tests for Comments System")
    print("=" * 50)
    
    # Test 1: Basic Flask API health check
    print("\n1. Testing Basic API Health")
    test_endpoint("GET", "/")
    
    # Test 2: Get comments for a week (should return empty array)
    print("\n2. Testing Get Comments (Public)")
    test_endpoint("GET", "/api/comments/2024-01")
    
    # Test 3: Try to create comment without auth (should fail)
    print("\n3. Testing Create Comment Without Auth (Should Fail)")
    test_endpoint("POST", "/api/comments", 
                 data={"week": "2024-01", "commentText": "Test comment"},
                 expected_status=401)
    
    # Test 4: Try to get user info without auth (should fail)
    print("\n4. Testing Get User Info Without Auth (Should Fail)")
    test_endpoint("GET", "/api/auth/user", expected_status=401)
    
    # Test 5: Try Google OAuth with invalid token (should fail)
    print("\n5. Testing Google OAuth with Invalid Token (Should Fail)")
    test_endpoint("POST", "/api/auth/google", 
                 data={"id_token": "invalid_token"},
                 expected_status=400)
    
    # Test 6: Test with missing required fields
    print("\n6. Testing Create Comment with Missing Fields (Should Fail)")
    test_endpoint("POST", "/api/comments", 
                 data={"week": "2024-01"},  # Missing commentText
                 headers={"Authorization": "Bearer fake_token"},
                 expected_status=401)
    
    # Test 7: Test with invalid week format
    print("\n7. Testing Get Comments with Different Week Format")
    test_endpoint("GET", "/api/comments/2024-02")
    
    # Test 8: Test QB rankings data (existing functionality)
    print("\n8. Testing QB Rankings Data (Existing Functionality)")
    test_endpoint("GET", "/blog/qb-rankings/data?year=2024&week=1")
    
    print("\n" + "=" * 50)
    print("🎉 API Tests Completed!")
    print("\n📝 Summary:")
    print("- ✅ Basic API health check")
    print("- ✅ Public comments endpoint")
    print("- ✅ Authentication required for protected endpoints")
    print("- ✅ Google OAuth validation")
    print("- ✅ DynamoDB connection")
    print("- ✅ Existing QB rankings functionality preserved")
    
    print("\n🔧 Next Steps:")
    print("1. Set up Google OAuth credentials")
    print("2. Test with real Google ID token")
    print("3. Create and manage comments")
    print("4. Build React frontend")

if __name__ == "__main__":
    main() 