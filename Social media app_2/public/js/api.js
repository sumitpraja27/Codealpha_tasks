const API_BASE = '/api';

class ApiService {
  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders(isMultipart = false) {
    const headers = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const isMultipart = options.body instanceof FormData;
    const url = `${API_BASE}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...options.headers,
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth
  login(usernameOrEmail, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password })
    });
  }

  register(username, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Posts
  getFeed() {
    return this.request('/posts');
  }

  createPost(content, imageFile) {
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.request('/posts', {
      method: 'POST',
      body: formData
    });
  }

  deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE'
    });
  }

  toggleLike(postId) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST'
    });
  }

  // Comments
  getComments(postId) {
    return this.request(`/posts/${postId}/comments`);
  }

  createComment(postId, content) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  deleteComment(commentId) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  }

  // Users & Follows
  getProfile(username) {
    return this.request(`/users/${username}`);
  }

  updateProfile(bio, avatarFile) {
    const formData = new FormData();
    if (bio !== undefined) formData.append('bio', bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    
    return this.request('/users/profile', {
      method: 'PUT',
      body: formData
    });
  }

  toggleFollow(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST'
    });
  }

  getFollowers(username) {
    return this.request(`/users/${username}/followers`);
  }

  getFollowing(username) {
    return this.request(`/users/${username}/following`);
  }
}

window.api = new ApiService();
