import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../config';
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

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments/${week}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (week) {
      fetchComments();
    }
  }, [week]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/auth/google', {
        id_token: credentialResponse.credential
      });

      const { token, user: userInfo } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userInfo);
    } catch (error) {
      console.error('Google auth error:', error);
      alert('Failed to sign in with Google');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In was unsuccessful');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post('/api/comments', {
        week,
        commentText: newComment.trim(),
        parentCommentId: replyTo
      });

      setNewComment('');
      setReplyTo(null);
      setReplyText('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error creating comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to create comment: ${errorMsg}`);
    }
  };

  const handleSubmitReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const response = await axios.post('/api/comments', {
        week,
        commentText: replyText.trim(),
        parentCommentId: parentCommentId
      });

      setReplyTo(null);
      setReplyText('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error creating reply:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to create reply: ${errorMsg}`);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(`/api/comments/${week}/${commentId}`, {
        commentText: editText.trim()
      });

      setEditingComment(null);
      setEditText('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error editing comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to edit comment: ${errorMsg}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await axios.delete(`/api/comments/${week}/${commentId}`);
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to delete comment: ${errorMsg}`);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert('Please sign in to like comments');
      return;
    }

    try {
      const response = await axios.post(`/api/comments/${week}/${commentId}/like`);
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error liking comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to like comment: ${errorMsg}`);
    }
  };

  const handleUnlikeComment = async (commentId) => {
    if (!user) {
      alert('Please sign in to unlike comments');
      return;
    }

    try {
      const response = await axios.post(`/api/comments/${week}/${commentId}/unlike`);
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error unliking comment:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to unlike comment: ${errorMsg}`);
    }
  };

  const isCommentLiked = (comment) => {
    if (!user || !comment.likes) return false;
    return comment.likes.includes(user.id);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderComment = (comment, isReply = false) => {
    const isOwner = user && comment.userId === user.id;
    const isEditing = editingComment === comment.commentId;

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
      
      {/* Authentication Section - Moved to top */}
      {!user ? (
        <div className="auth-section">
          <div className="login-section">
            <p>Sign in to comment and like posts</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>
      ) : (
        <div className="auth-section">
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
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>

      {/* Comment Form - Moved to bottom */}
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
    </div>
  );
};

export default Comments; 