#!/usr/bin/env python3
"""
Test Delete Functionality
Simulates the delete comment workflow to identify issues
"""

import requests
import json

# Configuration
FLASK_URL = "http://localhost:5001"

def test_delete_without_auth():
    """Test delete without authentication (should fail)"""
    print("🔍 Testing Delete Without Authentication...")
    try:
        response = requests.delete(f"{FLASK_URL}/api/comments/test-comment-id")
        print(f"✅ DELETE without auth: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ DELETE without auth failed: {e}")

def test_delete_with_invalid_token():
    """Test delete with invalid token (should fail)"""
    print("\n🔍 Testing Delete With Invalid Token...")
    try:
        headers = {"Authorization": "Bearer invalid_token"}
        response = requests.delete(f"{FLASK_URL}/api/comments/test-comment-id", headers=headers)
        print(f"✅ DELETE with invalid token: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ DELETE with invalid token failed: {e}")

def test_delete_nonexistent_comment():
    """Test delete with valid auth but nonexistent comment"""
    print("\n🔍 Testing Delete Nonexistent Comment...")
    try:
        # This would need a real JWT token to test properly
        headers = {"Authorization": "Bearer fake_but_valid_format_token"}
        response = requests.delete(f"{FLASK_URL}/api/comments/nonexistent-comment-id", headers=headers)
        print(f"✅ DELETE nonexistent comment: {response.status_code}")
        if response.status_code != 401:  # If not auth error, show response
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ DELETE nonexistent comment failed: {e}")

def check_backend_logs():
    """Provide guidance for checking backend logs"""
    print("\n🔍 Backend Logs Check:")
    print("1. Look at your Flask server console")
    print("2. Check for any error messages when delete is attempted")
    print("3. Look for DynamoDB errors or connection issues")
    print("4. Check if the delete request is reaching the backend")

def provide_debugging_steps():
    """Provide comprehensive debugging steps"""
    print("\n🔧 Debugging Steps for Delete Functionality:")
    print("=" * 50)
    
    print("\n1. **Check Browser Console:**")
    print("   - Open DevTools (F12)")
    print("   - Go to Console tab")
    print("   - Try to delete a comment")
    print("   - Look for JavaScript errors or failed requests")
    
    print("\n2. **Check Network Tab:**")
    print("   - Go to Network tab in DevTools")
    print("   - Try to delete a comment")
    print("   - Look for DELETE request to /api/comments/{id}")
    print("   - Check request headers (Authorization)")
    print("   - Check response status and body")
    
    print("\n3. **Check Backend Logs:**")
    print("   - Look at Flask server console")
    print("   - Check for any error messages")
    print("   - Verify the delete request reaches the backend")
    
    print("\n4. **Check DynamoDB:**")
    print("   - Verify DynamoDB connection")
    print("   - Check if the comment exists in the database")
    print("   - Verify user permissions")
    
    print("\n5. **Test API Directly:**")
    print("   - Use curl or Postman with a real JWT token")
    print("   - Test the delete endpoint directly")
    
    return True

def main():
    print("🚀 Delete Functionality Test")
    print("=" * 50)
    
    tests = [
        ("Delete Without Auth", test_delete_without_auth),
        ("Delete With Invalid Token", test_delete_with_invalid_token),
        ("Delete Nonexistent Comment", test_delete_nonexistent_comment),
        ("Backend Logs Check", check_backend_logs),
        ("Debugging Steps", provide_debugging_steps),
    ]
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 40)
        test_func()
    
    print("\n" + "=" * 50)
    print("🎯 Next Steps:")
    print("1. Check browser console for errors")
    print("2. Check network tab for failed requests")
    print("3. Check backend logs for errors")
    print("4. Verify DynamoDB connection and permissions")

if __name__ == "__main__":
    main() 