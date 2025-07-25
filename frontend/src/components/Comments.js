import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Comments.css';

const Comments = ({ week }) => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      // Set default auth header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setDebugInfo(`User loaded: ${JSON.parse(savedUser).name}`);
    } else {
      setDebugInfo('No saved user found');
    }
  }, []);

  // Fetch comments when week changes
  useEffect(() => {
    if (week) {
      fetchComments();
    }
  }, [week]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log('Fetching comments for week:', week);
      const response = await axios.get(`/api/comments/${week}`);
      console.log('Comments response:', response.data);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google OAuth success, credential:', credentialResponse.credential.substring(0, 50) + '...');
      
      const response = await axios.post('/api/auth/google', {
        id_token: credentialResponse.credential
      });

      const { token, user: userData } = response.data;
      
      console.log('Backend auth response:', { token: token.substring(0, 50) + '...', user: userData });
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set user state and auth header
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setDebugInfo(`Logged in as: ${userData.name}`);
      console.log('Successfully logged in:', userData);
    } catch (error) {
      console.error('Login error:', error);
      setDebugInfo(`Login failed: ${error.response?.data?.error || error.message}`);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setDebugInfo('Google login failed');
    alert('Google login failed. Please try again.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    setDebugInfo('Logged out');
  };

  const testCommentCreation = async () => {
    if (!user) {
      setDebugInfo('No user logged in');
      return;
    }

    try {
      const testData = {
        week,
        commentText: 'Test comment from debug button',
        parentCommentId: null
      };

      console.log('Testing comment creation with:', testData);
      console.log('Auth header:', axios.defaults.headers.common['Authorization']);

      const response = await axios.post('/api/comments', testData);
      console.log('Test comment created:', response.data);
      setDebugInfo('Test comment created successfully!');
      fetchComments();
    } catch (error) {
      console.error('Test comment creation failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Test failed: ${errorMsg}`);
    }
  };

  const testReplyCreation = async () => {
    if (!user) {
      setDebugInfo('No user logged in');
      return;
    }

    if (comments.length === 0) {
      setDebugInfo('No comments to reply to. Create a comment first.');
      return;
    }

    try {
      const parentComment = comments[0]; // Reply to the first comment
      const testData = {
        week,
        commentText: 'Test reply from debug button',
        parentCommentId: parentComment.commentId
      };

      console.log('Testing reply creation with:', testData);
      console.log('Auth header:', axios.defaults.headers.common['Authorization']);

      const response = await axios.post('/api/comments', testData);
      console.log('Test reply created:', response.data);
      setDebugInfo('Test reply created successfully!');
      fetchComments();
    } catch (error) {
      console.error('Test reply creation failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Test reply failed: ${errorMsg}`);
    }
  };

  const testUserInfo = () => {
    if (!user) {
      setDebugInfo('No user logged in');
      return;
    }

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: localStorage.getItem('token')?.substring(0, 50) + '...'
    };

    console.log('Current user info:', userInfo);
    setDebugInfo(`User ID: ${user.id}, Name: ${user.name}`);
  };

  const testDeleteComment = async () => {
    if (!user) {
      setDebugInfo('No user logged in');
      return;
    }

    if (comments.length === 0) {
      setDebugInfo('No comments to delete. Create a comment first.');
      return;
    }

    try {
      const commentToDelete = comments[0]; // Delete the first comment
      console.log('Testing delete for comment:', commentToDelete.commentId);
      console.log('Comment user ID:', commentToDelete.userId);
      console.log('Current user ID:', user.id);
      console.log('Auth header:', axios.defaults.headers.common['Authorization']);

      const response = await axios.delete(`/api/comments/${week}/${commentToDelete.commentId}`);
      console.log('Test delete response:', response.data);
      setDebugInfo('Test delete successful!');
      fetchComments();
    } catch (error) {
      console.error('Test delete failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Test delete failed: ${errorMsg}`);
    }
  };

  const testEditComment = async () => {
    if (!user) {
      setDebugInfo('No user logged in');
      return;
    }

    if (comments.length === 0) {
      setDebugInfo('No comments to edit. Create a comment first.');
      return;
    }

    try {
      const commentToEdit = comments[0]; // Edit the first comment
      const newText = 'Test edit from debug button - ' + new Date().toLocaleTimeString();
      
      console.log('Testing edit for comment:', commentToEdit.commentId);
      console.log('Comment user ID:', commentToEdit.userId);
      console.log('Current user ID:', user.id);
      console.log('New text:', newText);
      console.log('Auth header:', axios.defaults.headers.common['Authorization']);

      const response = await axios.put(`/api/comments/${week}/${commentToEdit.commentId}`, {
        commentText: newText
      });
      console.log('Test edit response:', response.data);
      setDebugInfo('Test edit successful!');
      fetchComments();
    } catch (error) {
      console.error('Test edit failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Test edit failed: ${errorMsg}`);
    }
  };

  const testLikeComment = async () => {
    if (!user) {
      setDebugInfo('No user logged in');
      return;
    }

    if (comments.length === 0) {
      setDebugInfo('No comments to like. Create a comment first.');
      return;
    }

    try {
      const commentToLike = comments[0]; // Like the first comment
      const isLiked = isCommentLiked(commentToLike);
      
      console.log('Testing like/unlike for comment:', commentToLike.commentId);
      console.log('Current user ID:', user.id);
      console.log('Is already liked:', isLiked);
      console.log('Auth header:', axios.defaults.headers.common['Authorization']);

      const endpoint = isLiked ? 'unlike' : 'like';
      const response = await axios.post(`/api/comments/${week}/${commentToLike.commentId}/${endpoint}`);
      console.log('Test like response:', response.data);
      setDebugInfo(`Test ${endpoint} successful!`);
      fetchComments();
    } catch (error) {
      console.error('Test like failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Test like failed: ${errorMsg}`);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      console.log('Submitting comment:', {
        week,
        commentText: newComment.trim(),
        parentCommentId: replyTo,
        authHeader: axios.defaults.headers.common['Authorization']?.substring(0, 50) + '...'
      });

      const response = await axios.post('/api/comments', {
        week,
        commentText: newComment.trim(),
        parentCommentId: replyTo
      });

      console.log('Comment created successfully:', response.data);
      setNewComment('');
      setReplyTo(null);
      setReplyText('');
      setDebugInfo('Comment posted successfully!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error creating comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Comment creation failed: ${errorMsg}`);
      alert(`Failed to create comment: ${errorMsg}`);
    }
  };

  const handleSubmitReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      console.log('Submitting reply:', {
        week,
        commentText: replyText.trim(),
        parentCommentId: parentCommentId,
        authHeader: axios.defaults.headers.common['Authorization']?.substring(0, 50) + '...'
      });

      const response = await axios.post('/api/comments', {
        week,
        commentText: replyText.trim(),
        parentCommentId: parentCommentId
      });

      console.log('Reply created successfully:', response.data);
      setReplyTo(null);
      setReplyText('');
      setDebugInfo('Reply posted successfully!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error creating reply:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Reply creation failed: ${errorMsg}`);
      alert(`Failed to create reply: ${errorMsg}`);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      console.log('Editing comment:', commentId);
      console.log('Edit text:', editText);
      console.log('Current user ID:', user.id);
      
      const response = await axios.put(`/api/comments/${week}/${commentId}`, {
        commentText: editText.trim()
      });

      console.log('Edit response:', response.data);
      setEditingComment(null);
      setEditText('');
      setDebugInfo('Comment edited successfully!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error editing comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Edit failed: ${errorMsg}`);
      alert(`Failed to edit comment: ${errorMsg}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      console.log('Deleting comment:', commentId);
      console.log('Current user ID:', user.id);
      
      const response = await axios.delete(`/api/comments/${week}/${commentId}`);
      console.log('Delete response:', response.data);
      setDebugInfo('Comment deleted successfully!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Delete failed: ${errorMsg}`);
      alert(`Failed to delete comment: ${errorMsg}`);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      setDebugInfo('Please sign in to like comments');
      return;
    }

    try {
      const response = await axios.post(`/api/comments/${week}/${commentId}/like`);
      console.log('Like response:', response.data);
      setDebugInfo('Comment liked!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error liking comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Like failed: ${errorMsg}`);
    }
  };

  const handleUnlikeComment = async (commentId) => {
    if (!user) {
      setDebugInfo('Please sign in to unlike comments');
      return;
    }

    try {
      const response = await axios.post(`/api/comments/${week}/${commentId}/unlike`);
      console.log('Unlike response:', response.data);
      setDebugInfo('Comment unliked!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error unliking comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setDebugInfo(`Unlike failed: ${errorMsg}`);
    }
  };

  const isCommentLiked = (comment) => {
    if (!user || !comment.likes) return false;
    return comment.likes.includes(user.id);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderComment = (comment, isReply = false) => {
    const isOwner = user && comment.userId === user.id;
    const isEditing = editingComment === comment.commentId;

    // Debug user ID comparison
    console.log('Comment user ID:', comment.userId);
    console.log('Current user ID:', user?.id);
    console.log('Is owner:', isOwner);

    return (
      <div key={comment.commentId} className={`comment ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            <img 
              src={comment.userAvatar || '/default-avatar.png'} 
              alt={comment.userName}
              className="author-avatar"
            />
            <span className="author-name">{comment.userName}</span>
            <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
          </div>
          {isOwner && (
            <div className="comment-actions">
              <button 
                className="action-btn edit-btn"
                onClick={() => {
                  setEditingComment(comment.commentId);
                  setEditText(comment.commentText);
                }}
              >
                Edit
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeleteComment(comment.commentId)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="comment-content">
          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-textarea"
                rows="3"
              />
              <div className="edit-actions">
                <button 
                  onClick={() => handleEditComment(comment.commentId)}
                  className="save-btn"
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    setEditingComment(null);
                    setEditText('');
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>{comment.commentText}</p>
          )}
        </div>

        {/* Like functionality */}
        <div className="comment-actions-bottom">
          <div className="like-section">
            {user ? (
              <button
                className={`like-btn ${isCommentLiked(comment) ? 'liked' : ''}`}
                onClick={() => isCommentLiked(comment) 
                  ? handleUnlikeComment(comment.commentId)
                  : handleLikeComment(comment.commentId)
                }
              >
                {isCommentLiked(comment) ? '❤️' : '🤍'} 
                {comment.likes && comment.likes.length > 0 ? comment.likes.length : 0}
              </button>
            ) : (
              <span className="like-count">
                🤍 {comment.likes && comment.likes.length > 0 ? comment.likes.length : 0}
              </span>
            )}
          </div>
          
          {!isReply && user && (
            <button 
              className="reply-btn"
              onClick={() => setReplyTo(comment.commentId)}
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply form */}
        {replyTo === comment.commentId && user && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (replyText.trim()) {
              handleSubmitReply(e, comment.commentId);
            }
          }} className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="reply-textarea"
              rows="3"
            />
            <div className="reply-actions">
              <button type="submit" className="submit-btn">Reply</button>
              <button 
                type="button" 
                onClick={() => {
                  setReplyTo(null);
                  setReplyText('');
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments</h3>
      
      {/* Debug Info */}
      {debugInfo && (
        <div className="debug-info" style={{ 
          background: '#f0f8ff', 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '5px',
          fontSize: '14px',
          color: '#333'
        }}>
          <strong>Debug:</strong> {debugInfo}
          <br />
          <strong>Week:</strong> {week}
          <br />
          <strong>User:</strong> {user ? user.name : 'Not logged in'}
          <br />
          <strong>User ID:</strong> {user ? user.id : 'N/A'}
          <br />
          <strong>Auth Header:</strong> {axios.defaults.headers.common['Authorization'] ? 'Set' : 'Not set'}
          <br />
          <strong>Comments Count:</strong> {comments.length}
          {comments.length > 0 && (
            <>
              <br />
              <strong>First Comment User ID:</strong> {comments[0]?.userId}
              <br />
              <strong>Is Owner of First Comment:</strong> {user && comments[0]?.userId === user.id ? 'Yes' : 'No'}
              <br />
              <strong>First Comment Likes:</strong> {comments[0]?.likes ? comments[0].likes.length : 0}
              <br />
              <strong>Is First Comment Liked by User:</strong> {user && comments[0]?.likes ? comments[0].likes.includes(user.id) ? 'Yes' : 'No' : 'N/A'}
            </>
          )}
        </div>
      )}
      
      {/* Test Button */}
      {user && (
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={testCommentCreation}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px'
            }}
          >
            Test Comment Creation
          </button>
          <button 
            onClick={testReplyCreation}
            style={{
              background: '#f39c12',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test Reply Creation
          </button>
          <button 
            onClick={testUserInfo}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Test User Info
          </button>
          <button 
            onClick={testDeleteComment}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Test Delete Comment
          </button>
          <button 
            onClick={testEditComment}
            style={{
              background: '#9b59b6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Test Edit Comment
          </button>
          <button 
            onClick={testLikeComment}
            style={{
              background: '#2980b9',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Test Like/Unlike
          </button>
        </div>
      )}
      
      {/* Authentication Section */}
      <div className="auth-section">
        {!user ? (
          <div className="login-section">
            <p>Sign in to comment:</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        ) : (
          <div className="user-section">
            <div className="user-info">
              <img 
                src={user.picture || '/default-avatar.png'} 
                alt={user.name}
                className="user-avatar"
              />
              <span className="user-name">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-textarea"
            rows="4"
            required
          />
          <button type="submit" className="submit-btn" disabled={!newComment.trim()}>
            Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <p className="loading">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default Comments; 