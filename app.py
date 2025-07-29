from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
import boto3
import jwt
import uuid
import requests
from datetime import datetime, timedelta
from functools import wraps
from config import get_config

# Load environment variables
load_dotenv()

# Get configuration based on environment
config = get_config()

app = Flask(__name__)
app.config.from_object(config)
CORS(app, resources={r"/*": {"origins": config.CORS_ORIGINS}})

# Database configuration using config
DB_CONFIG = config.DATABASE_CONFIG

# AWS DynamoDB setup for comments
dynamodb = boto3.resource('dynamodb',
    aws_access_key_id=config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
    region_name=config.AWS_REGION
)

comments_table = dynamodb.Table(config.DYNAMODB_TABLE_NAME)

# Google OAuth configuration
GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID

# Authentication helper functions
def create_jwt_token(user_info):
    """Create JWT token for user session"""
    payload = {
        'user_id': user_info['sub'],
        'email': user_info['email'],
        'name': user_info['name'],
        'picture': user_info.get('picture', ''),
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, config.SECRET_KEY, algorithm='HS256')

def verify_jwt_token(token):
    """Verify JWT token and return user info"""
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authentication required'}), 401
        
        token = auth_header.split(' ')[1]
        user_info = verify_jwt_token(token)
        if not user_info:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        request.user_info = user_info
        return f(*args, **kwargs)
    return decorated_function

# Existing routes
@app.route('/')
def home():
    return jsonify({'message': 'Flask API is working!', 'status': 'success'})

@app.route('/home')
def home_page():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/test')
def test():
    return jsonify({'message': 'Flask is working!'})

@app.route('/blog/qb-rankings/data')
def qb_rankings_data():
    year = request.args.get('year', type=int)
    week = request.args.get('week', type=int)
    print(f"Received request for year: {year}, week: {week}")
    
    if year is None or week is None:
        print("Missing year or week parameter")
        return jsonify({'error': 'Missing year or week'}), 400
    
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print("Database connection successful")
        cursor = conn.cursor(dictionary=True)
        query = 'SELECT * FROM qb_rankings WHERE year = %s AND week IN (%s, %s) ORDER BY week DESC'
        params = (year, week-1, week)
        print(f"Executing query: {query} with params: {params}")
        cursor.execute(query, params)
        results = cursor.fetchall()
        print(f"Query returned {len(results)} results")
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/blog/qb-rankings')
def qb_rankings():
    return render_template('qb_rankings.html')

# Comments API routes
@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """Handle Google OAuth callback"""
    try:
        data = request.get_json()
        id_token = data.get('id_token')
        
        if not id_token:
            return jsonify({'error': 'ID token required'}), 400
        
        # Verify the token with Google
        response = requests.get(
            f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
        )
        
        if response.status_code != 200:
            return jsonify({'error': 'Invalid ID token'}), 400
        
        user_info = response.json()
        
        # Verify the client ID
        if user_info['aud'] != GOOGLE_CLIENT_ID:
            return jsonify({'error': 'Invalid client ID'}), 400
        
        # Create JWT token
        jwt_token = create_jwt_token(user_info)
        
        return jsonify({
            'token': jwt_token,
            'user': {
                'id': user_info['sub'],
                'email': user_info['email'],
                'name': user_info['name'],
                'picture': user_info.get('picture', '')
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/user', methods=['GET'])
@require_auth
def get_user():
    """Get current user info"""
    return jsonify({
        'id': request.user_info['user_id'],
        'email': request.user_info['email'],
        'name': request.user_info['name'],
        'picture': request.user_info['picture']
    })

@app.route('/api/comments/<week>', methods=['GET'])
def get_comments(week):
    """Get all comments for a specific week"""
    try:
        # Get top-level comments (those without parentCommentId)
        response = comments_table.query(
            KeyConditionExpression='week = :week AND begins_with(commentId, :prefix)',
            ExpressionAttributeValues={
                ':week': week,
                ':prefix': 'comment_'
            },
            ScanIndexForward=True  # Oldest first
        )
        
        comments = response.get('Items', [])
        
        # Filter out replies (comments with parentCommentId) from the main list
        top_level_comments = [comment for comment in comments if 'parentCommentId' not in comment]
        
        # Get replies for each top-level comment
        for comment in top_level_comments:
            replies_response = comments_table.query(
                IndexName='parentCommentId-index',
                KeyConditionExpression='parentCommentId = :parentId',
                ExpressionAttributeValues={
                    ':parentId': comment['commentId']
                },
                ScanIndexForward=True  # Oldest first for replies
            )
            comment['replies'] = replies_response.get('Items', [])
        
        return jsonify({'comments': top_level_comments})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments', methods=['POST'])
@require_auth
def create_comment():
    """Create a new comment"""
    try:
        data = request.get_json()
        week = data.get('week')
        comment_text = data.get('commentText')
        parent_comment_id = data.get('parentCommentId')
        
        if not week or not comment_text:
            return jsonify({'error': 'Week and comment text are required'}), 400
        
        comment_id = f"comment_{uuid.uuid4()}"
        
        comment = {
            'commentId': comment_id,
            'week': week,
            'userId': request.user_info['user_id'],
            'userName': request.user_info['name'],
            'userEmail': request.user_info['email'],
            'userAvatar': request.user_info['picture'],
            'commentText': comment_text,
            'timestamp': datetime.utcnow().isoformat(),
            'likes': []
        }
        
        # Only add parentCommentId if it's not null (for replies)
        if parent_comment_id:
            comment['parentCommentId'] = parent_comment_id
        
        comments_table.put_item(Item=comment)
        
        return jsonify({'comment': comment}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<week>/<comment_id>', methods=['PUT'])
@require_auth
def update_comment(week, comment_id):
    """Update a comment (owner only)"""
    try:
        data = request.get_json()
        comment_text = data.get('commentText')
        
        if not comment_text:
            return jsonify({'error': 'Comment text is required'}), 400
        
        # Get the comment first to check ownership
        response = comments_table.get_item(Key={'week': week, 'commentId': comment_id})
        if 'Item' not in response:
            return jsonify({'error': 'Comment not found'}), 404
        
        comment = response['Item']
        if comment['userId'] != request.user_info['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update the comment
        comments_table.update_item(
            Key={'week': week, 'commentId': comment_id},
            UpdateExpression='SET commentText = :text, #ts = :timestamp',
            ExpressionAttributeNames={
                '#ts': 'timestamp'
            },
            ExpressionAttributeValues={
                ':text': comment_text,
                ':timestamp': datetime.utcnow().isoformat()
            }
        )
        
        return jsonify({'message': 'Comment updated successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<week>/<comment_id>', methods=['DELETE'])
@require_auth
def delete_comment(week, comment_id):
    """Delete a comment (owner only)"""
    try:
        # Get the comment first to check ownership
        response = comments_table.get_item(Key={'week': week, 'commentId': comment_id})
        if 'Item' not in response:
            return jsonify({'error': 'Comment not found'}), 404
        
        comment = response['Item']
        if comment['userId'] != request.user_info['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Delete the comment
        comments_table.delete_item(Key={'week': week, 'commentId': comment_id})
        
        # Delete all replies to this comment
        replies_response = comments_table.query(
            IndexName='parentCommentId-index',
            KeyConditionExpression='parentCommentId = :parentId',
            ExpressionAttributeValues={
                ':parentId': comment_id
            }
        )
        
        for reply in replies_response.get('Items', []):
            # For replies, we need to get the week from the reply itself
            comments_table.delete_item(Key={'week': reply['week'], 'commentId': reply['commentId']})
        
        return jsonify({'message': 'Comment deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<week>/<comment_id>/like', methods=['POST'])
@require_auth
def like_comment(week, comment_id):
    """Like a comment"""
    try:
        user_id = request.user_info['user_id']
        
        # Get the comment first
        response = comments_table.get_item(Key={'week': week, 'commentId': comment_id})
        if 'Item' not in response:
            return jsonify({'error': 'Comment not found'}), 404
        
        comment = response['Item']
        
        # Initialize likes array if it doesn't exist
        if 'likes' not in comment:
            comment['likes'] = []
        
        # Check if user already liked this comment
        if user_id in comment['likes']:
            return jsonify({'error': 'Comment already liked'}), 400
        
        # Add user to likes array
        comment['likes'].append(user_id)
        
        # Update the comment
        comments_table.update_item(
            Key={'week': week, 'commentId': comment_id},
            UpdateExpression='SET likes = :likes',
            ExpressionAttributeValues={
                ':likes': comment['likes']
            }
        )
        
        return jsonify({
            'message': 'Comment liked successfully',
            'likesCount': len(comment['likes']),
            'isLiked': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<week>/<comment_id>/unlike', methods=['POST'])
@require_auth
def unlike_comment(week, comment_id):
    """Unlike a comment"""
    try:
        user_id = request.user_info['user_id']
        
        # Get the comment first
        response = comments_table.get_item(Key={'week': week, 'commentId': comment_id})
        if 'Item' not in response:
            return jsonify({'error': 'Comment not found'}), 404
        
        comment = response['Item']
        
        # Initialize likes array if it doesn't exist
        if 'likes' not in comment:
            comment['likes'] = []
        
        # Check if user has liked this comment
        if user_id not in comment['likes']:
            return jsonify({'error': 'Comment not liked'}), 400
        
        # Remove user from likes array
        comment['likes'].remove(user_id)
        
        # Update the comment
        comments_table.update_item(
            Key={'week': week, 'commentId': comment_id},
            UpdateExpression='SET likes = :likes',
            ExpressionAttributeValues={
                ':likes': comment['likes']
            }
        )
        
        return jsonify({
            'message': 'Comment unliked successfully',
            'likesCount': len(comment['likes']),
            'isLiked': False
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/deployment-test')
def deployment_test():
    return jsonify({
        'message': 'Automatic deployment is working!',
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    app.run(
        debug=config.DEBUG, 
        host='0.0.0.0', 
        port=int(os.getenv('PORT', 5000))
    ) 