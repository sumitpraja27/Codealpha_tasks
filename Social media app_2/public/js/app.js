// ==========================================================================
// VibeNet Frontend Application Controller (SPA Orchestrator)
// ==========================================================================

// 1. Application State
let currentUser = null;
let activeTab = 'feed'; // 'feed' | 'profile'
let profileUsername = null; // Username of currently viewed profile
let selectedPostImage = null; // File object for new post image
let selectedAvatarImage = null; // File object for avatar update

// 2. DOM Elements Cache
const DOM = {
  // Views
  authView: document.getElementById('auth-view'),
  appView: document.getElementById('app-view'),
  feedPanel: document.getElementById('feed-panel'),
  profilePanel: document.getElementById('profile-panel'),
  
  // Auth Forms
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  switchToRegister: document.getElementById('switch-to-register'),
  switchToLogin: document.getElementById('switch-to-login'),
  
  // Nav buttons
  navFeed: document.getElementById('nav-feed'),
  navProfile: document.getElementById('nav-profile'),
  navCreatePost: document.getElementById('nav-create-post-trigger'),
  btnLogout: document.getElementById('btn-logout'),
  sidebarUserCard: document.getElementById('sidebar-user-card'),
  
  // Sidebar info
  sidebarAvatar: document.getElementById('sidebar-avatar'),
  sidebarUsername: document.getElementById('sidebar-username'),
  sidebarUsertag: document.getElementById('sidebar-usertag'),

  // Feed
  postCreatorAvatar: document.getElementById('post-creator-avatar'),
  createPostForm: document.getElementById('create-post-form'),
  postContent: document.getElementById('post-content'),
  postImageInput: document.getElementById('post-image-input'),
  postImagePreviewContainer: document.getElementById('post-image-preview-container'),
  postImagePreview: document.getElementById('post-image-preview'),
  removePreviewBtn: document.getElementById('remove-preview-btn'),
  postsContainer: document.getElementById('posts-container'),

  // Profile
  profileAvatar: document.getElementById('profile-avatar'),
  profileUsername: document.getElementById('profile-username'),
  profileJoinedDate: document.getElementById('profile-joined-date'),
  profileBio: document.getElementById('profile-bio'),
  profilePostsContainer: document.getElementById('profile-posts-container'),
  btnEditProfile: document.getElementById('btn-edit-profile'),
  btnFollowUser: document.getElementById('btn-follow-user'),
  statPosts: document.getElementById('stat-posts'),
  statFollowers: document.getElementById('stat-followers'),
  statFollowing: document.getElementById('stat-following'),
  statFollowersBtn: document.getElementById('stat-followers-btn'),
  statFollowingBtn: document.getElementById('stat-following-btn'),
  profilePostsTitle: document.getElementById('profile-posts-title'),

  // Edit Profile Modal
  editProfileModal: document.getElementById('edit-profile-modal'),
  editProfileForm: document.getElementById('edit-profile-form'),
  editAvatarPreview: document.getElementById('edit-avatar-preview'),
  editAvatarInput: document.getElementById('edit-avatar-input'),
  editBio: document.getElementById('edit-bio'),
  btnCloseEditModal: document.getElementById('btn-close-edit-modal'),
  btnCancelEditProfile: document.getElementById('btn-cancel-edit-profile'),

  // Followers/Following Modal
  usersModal: document.getElementById('users-modal'),
  usersModalTitle: document.getElementById('users-modal-title'),
  usersModalList: document.getElementById('users-modal-list'),
  btnCloseUsersModal: document.getElementById('btn-close-users-modal'),

  // Overlays
  loadingOverlay: document.getElementById('loading-overlay')
};

// ==========================================================================
// 3. Helper Functions & Utilities
// ==========================================================================

function showLoading(show) {
  if (show) DOM.loadingOverlay.classList.remove('hidden');
  else DOM.loadingOverlay.classList.add('hidden');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <div class="toast-message">${message}</div>
    <button class="toast-close"><i data-lucide="x"></i></button>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  // Toast dismiss listener
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  });
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 200);
    }
  }, 4000);
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getAvatarUrl(url, username) {
  if (url) return url;
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`;
}

// ==========================================================================
// 4. View Routing & DOM Rendering
// ==========================================================================

function switchView(view) {
  if (view === 'auth') {
    DOM.appView.classList.add('hidden');
    DOM.authView.classList.remove('hidden');
  } else if (view === 'app') {
    DOM.authView.classList.add('hidden');
    DOM.appView.classList.remove('hidden');
    
    // Update sidebar profiles
    DOM.sidebarAvatar.src = getAvatarUrl(currentUser.avatar_url, currentUser.username);
    DOM.sidebarUsername.textContent = `@${currentUser.username}`;
    DOM.postCreatorAvatar.src = getAvatarUrl(currentUser.avatar_url, currentUser.username);
    
    navigateToTab('feed');
  }
}

async function navigateToTab(tab) {
  activeTab = tab;
  
  DOM.navFeed.classList.remove('active');
  DOM.navProfile.classList.remove('active');
  
  DOM.feedPanel.classList.add('hidden');
  DOM.profilePanel.classList.add('hidden');
  
  if (tab === 'feed') {
    DOM.navFeed.classList.add('active');
    DOM.feedPanel.classList.remove('hidden');
    await loadFeed();
  } else if (tab === 'profile') {
    DOM.navProfile.classList.add('active');
    DOM.profilePanel.classList.remove('hidden');
    await loadProfile(currentUser.username);
  }
  
  lucide.createIcons();
}

// ==========================================================================
// 5. Posts Feed Rendering
// ==========================================================================

async function loadFeed() {
  try {
    const posts = await api.getFeed();
    renderPosts(posts, DOM.postsContainer);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderPosts(posts, container) {
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted);">
        <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--text-muted);"></i>
        <p>No vibes shared yet. Be the first to share one!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = posts.map(post => {
    const isOwner = post.author_id === currentUser.id;
    const deleteBtn = isOwner ? `
      <button class="btn-delete-post" data-post-id="${post.id}">
        <i data-lucide="trash-2"></i>
      </button>
    ` : '';

    const mediaHTML = post.image_url ? `
      <div class="post-media">
        <img src="${post.image_url}" alt="Post Image">
      </div>
    ` : '';

    const avatar = getAvatarUrl(post.author_avatar, post.author_username);

    return `
      <div class="post-card" data-post-id="${post.id}">
        <div class="post-header">
          <div class="post-author-info" data-username="${post.author_username}">
            <img src="${avatar}" alt="Avatar" class="user-avatar mini-avatar">
            <div class="user-details">
              <span class="post-author-name">@${post.author_username}</span>
              <span class="post-time">${formatDate(post.created_at)}</span>
            </div>
          </div>
          ${deleteBtn}
        </div>
        
        <div class="post-body">${escapeHTML(post.content)}</div>
        
        ${mediaHTML}
        
        <div class="post-footer">
          <button class="post-action-btn btn-like ${post.is_liked ? 'liked' : ''}" data-post-id="${post.id}">
            <i data-lucide="heart"></i>
            <span class="like-count">${post.likes_count}</span>
          </button>
          <button class="post-action-btn btn-comment" data-post-id="${post.id}">
            <i data-lucide="message-square"></i>
            <span class="comment-count">${post.comments_count}</span>
          </button>
        </div>

        <!-- Collapsible Comments Area -->
        <div class="comments-section hidden" id="comments-section-${post.id}">
          <form class="comment-input-form" data-post-id="${post.id}">
            <input type="text" placeholder="Write a comment..." required maxlength="300">
            <button type="submit" class="btn btn-primary" style="padding: 8px 16px;">
              <i data-lucide="send"></i>
            </button>
          </form>
          <div class="comments-list" id="comments-list-${post.id}">
            <!-- Loaded dynamically on expand -->
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
  attachPostCardListeners(container);
}

function attachPostCardListeners(container) {
  // Click on Author Profile
  container.querySelectorAll('.post-author-info').forEach(el => {
    el.addEventListener('click', () => {
      const username = el.getAttribute('data-username');
      loadProfile(username);
    });
  });

  // Like Button Click
  container.querySelectorAll('.btn-like').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const postId = btn.getAttribute('data-post-id');
      try {
        const result = await api.toggleLike(postId);
        const likeCountEl = btn.querySelector('.like-count');
        let likes = parseInt(likeCountEl.textContent);
        
        if (result.liked) {
          btn.classList.add('liked');
          likes += 1;
        } else {
          btn.classList.remove('liked');
          likes -= 1;
        }
        likeCountEl.textContent = likes;
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });

  // Comment Expand Toggle
  container.querySelectorAll('.btn-comment').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const postId = btn.getAttribute('data-post-id');
      const section = document.getElementById(`comments-section-${postId}`);
      
      if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        await loadComments(postId);
      } else {
        section.classList.add('hidden');
      }
    });
  });

  // Delete Post
  container.querySelectorAll('.btn-delete-post').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Are you sure you want to delete this post?')) return;
      
      const postId = btn.getAttribute('data-post-id');
      showLoading(true);
      try {
        await api.deletePost(postId);
        showToast('Post deleted successfully', 'success');
        
        // Reload whichever feed we are currently on
        if (activeTab === 'profile') {
          await loadProfile(profileUsername);
        } else {
          await loadFeed();
        }
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        showLoading(false);
      }
    });
  });

  // Submit Comment Form
  container.querySelectorAll('.comment-input-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const postId = form.getAttribute('data-post-id');
      const input = form.querySelector('input');
      const content = input.value.trim();
      
      if (!content) return;

      try {
        const newComment = await api.createComment(postId, content);
        input.value = '';
        showToast('Comment posted', 'success');
        
        // Append comment dynamically
        const listContainer = document.getElementById(`comments-list-${postId}`);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderCommentItemHTML(newComment);
        listContainer.appendChild(tempDiv.firstElementChild);
        lucide.createIcons();

        // Increment comment counter on button
        const card = container.querySelector(`.post-card[data-post-id="${postId}"]`);
        const commentCountEl = card.querySelector('.btn-comment .comment-count');
        commentCountEl.textContent = parseInt(commentCountEl.textContent) + 1;
        
        // Scroll to bottom of comments
        listContainer.scrollTop = listContainer.scrollHeight;
        
        attachCommentListeners(listContainer, postId);
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });
}

// ==========================================================================
// 6. Comments Area Rendering
// ==========================================================================

async function loadComments(postId) {
  const container = document.getElementById(`comments-list-${postId}`);
  container.innerHTML = '<div style="text-align:center; padding: 10px;"><div class="spinner" style="width:20px; height:20px; border-width:2px; margin: 0 auto;"></div></div>';
  
  try {
    const comments = await api.getComments(postId);
    
    if (comments.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 8px 0;">No comments yet.</p>';
      return;
    }

    container.innerHTML = comments.map(comment => renderCommentItemHTML(comment)).join('');
    lucide.createIcons();
    attachCommentListeners(container, postId);
  } catch (error) {
    container.innerHTML = `<p style="color:var(--danger); font-size: 0.85rem;">Error loading comments: ${error.message}</p>`;
  }
}

function renderCommentItemHTML(comment) {
  const isOwner = comment.author_id === currentUser.id;
  const deleteBtn = isOwner ? `
    <button class="btn-delete-comment" data-comment-id="${comment.id}">
      <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
    </button>
  ` : '';

  const avatar = getAvatarUrl(comment.author_avatar, comment.author_username);

  return `
    <div class="comment-item" data-comment-id="${comment.id}">
      <img src="${avatar}" alt="Avatar" class="comment-avatar">
      <div class="comment-content-wrapper">
        <div class="comment-meta">
          <span class="comment-author" data-username="${comment.author_username}">@${comment.author_username}</span>
          <div style="display:flex; align-items:center; gap: 8px;">
            <span class="comment-date">${formatDate(comment.created_at)}</span>
            ${deleteBtn}
          </div>
        </div>
        <div class="comment-body">${escapeHTML(comment.content)}</div>
      </div>
    </div>
  `;
}

function attachCommentListeners(container, postId) {
  // Author name click to navigate profile
  container.querySelectorAll('.comment-author').forEach(el => {
    el.addEventListener('click', () => {
      const username = el.getAttribute('data-username');
      // Hide users modal if open
      DOM.usersModal.classList.add('hidden');
      loadProfile(username);
    });
  });

  // Delete Comment Action
  container.querySelectorAll('.btn-delete-comment').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Delete this comment?')) return;
      
      const commentId = btn.getAttribute('data-comment-id');
      try {
        await api.deleteComment(commentId);
        showToast('Comment deleted', 'success');
        
        // Remove item from UI
        const commentEl = container.querySelector(`.comment-item[data-comment-id="${commentId}"]`);
        commentEl.remove();
        
        // Decrement comment count on button
        const card = document.querySelector(`.post-card[data-post-id="${postId}"]`);
        const commentCountEl = card.querySelector('.btn-comment .comment-count');
        commentCountEl.textContent = Math.max(0, parseInt(commentCountEl.textContent) - 1);
        
        if (container.children.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 8px 0;">No comments yet.</p>';
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });
}

// ==========================================================================
// 7. User Profile Rendering & Follows System
// ==========================================================================

async function loadProfile(username) {
  showLoading(true);
  profileUsername = username.toLowerCase();
  
  DOM.feedPanel.classList.add('hidden');
  DOM.profilePanel.classList.remove('hidden');
  
  DOM.navFeed.classList.remove('active');
  DOM.navProfile.classList.remove('active');
  if (profileUsername === currentUser.username) {
    DOM.navProfile.classList.add('active');
    DOM.profilePostsTitle.textContent = "My Vibes";
  } else {
    DOM.profilePostsTitle.textContent = `@${profileUsername}'s Vibes`;
  }
  
  try {
    const data = await api.getProfile(profileUsername);
    const user = data.user;
    
    // Fill profile fields
    DOM.profileAvatar.src = getAvatarUrl(user.avatar_url, user.username);
    DOM.profileUsername.textContent = `@${user.username}`;
    DOM.profileBio.textContent = user.bio || "No bio written yet.";
    DOM.profileJoinedDate.textContent = new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    
    // Fill stats
    DOM.statPosts.textContent = user.posts_count;
    DOM.statFollowers.textContent = user.followers_count;
    DOM.statFollowing.textContent = user.following_count;
    
    // Toggle Profile Actions (Edit Profile for current user, Follow button for other users)
    if (user.id === currentUser.id) {
      DOM.btnEditProfile.classList.remove('hidden');
      DOM.btnFollowUser.classList.add('hidden');
    } else {
      DOM.btnEditProfile.classList.add('hidden');
      DOM.btnFollowUser.classList.remove('hidden');
      
      // Update follow button look
      DOM.btnFollowUser.setAttribute('data-user-id', user.id);
      if (user.is_following) {
        DOM.btnFollowUser.className = 'btn btn-secondary';
        DOM.btnFollowUser.innerHTML = '<i data-lucide="user-check"></i> Following';
      } else {
        DOM.btnFollowUser.className = 'btn btn-primary';
        DOM.btnFollowUser.innerHTML = '<i data-lucide="user-plus"></i> Follow';
      }
    }
    
    // Render posts
    renderPosts(data.posts, DOM.profilePostsContainer);
  } catch (error) {
    showToast(error.message, 'error');
    navigateToTab('feed');
  } finally {
    showLoading(false);
  }
}

// Follow/Unfollow button click handler
DOM.btnFollowUser.addEventListener('click', async () => {
  const userId = DOM.btnFollowUser.getAttribute('data-user-id');
  try {
    const result = await api.toggleFollow(userId);
    let followersCount = parseInt(DOM.statFollowers.textContent);
    
    if (result.following) {
      DOM.btnFollowUser.className = 'btn btn-secondary';
      DOM.btnFollowUser.innerHTML = '<i data-lucide="user-check"></i> Following';
      followersCount += 1;
      showToast('You followed this user', 'success');
    } else {
      DOM.btnFollowUser.className = 'btn btn-primary';
      DOM.btnFollowUser.innerHTML = '<i data-lucide="user-plus"></i> Follow';
      followersCount -= 1;
      showToast('You unfollowed this user', 'info');
    }
    DOM.statFollowers.textContent = followersCount;
    lucide.createIcons();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Follower lists triggers
DOM.statFollowersBtn.addEventListener('click', () => showUsersModal('followers'));
DOM.statFollowingBtn.addEventListener('click', () => showUsersModal('following'));

async function showUsersModal(type) {
  DOM.usersModalTitle.textContent = type === 'followers' ? 'Followers' : 'Following';
  DOM.usersModalList.innerHTML = '<div style="text-align:center; padding: 20px;"><div class="spinner" style="margin:0 auto;"></div></div>';
  DOM.usersModal.classList.remove('hidden');
  
  try {
    const users = type === 'followers' 
      ? await api.getFollowers(profileUsername)
      : await api.getFollowing(profileUsername);
      
    if (users.length === 0) {
      DOM.usersModalList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px 0;">No ${type} yet.</p>`;
      return;
    }

    DOM.usersModalList.innerHTML = users.map(user => {
      const avatar = getAvatarUrl(user.avatar_url, user.username);
      const isMe = user.id === currentUser.id;
      
      let followActionBtn = '';
      if (!isMe) {
        if (user.is_following) {
          followActionBtn = `<button class="btn btn-secondary btn-sm follow-toggle-modal" data-user-id="${user.id}" data-username="${user.username}" style="padding: 6px 12px; font-size: 0.8rem;"><i data-lucide="user-check" style="width:12px; height:12px;"></i> Following</button>`;
        } else {
          followActionBtn = `<button class="btn btn-primary btn-sm follow-toggle-modal" data-user-id="${user.id}" data-username="${user.username}" style="padding: 6px 12px; font-size: 0.8rem;"><i data-lucide="user-plus" style="width:12px; height:12px;"></i> Follow</button>`;
        }
      }

      return `
        <div class="user-list-item">
          <div class="user-item-info" data-username="${user.username}">
            <img src="${avatar}" alt="Avatar" class="user-avatar mini-avatar">
            <div class="user-item-details">
              <span class="user-item-name">@${user.username}</span>
              <span class="user-item-bio">${escapeHTML(user.bio || 'Hello World!')}</span>
            </div>
          </div>
          ${followActionBtn}
        </div>
      `;
    }).join('');
    
    lucide.createIcons();
    
    // User clicks on names in list
    DOM.usersModalList.querySelectorAll('.user-item-info').forEach(item => {
      item.addEventListener('click', () => {
        DOM.usersModal.classList.add('hidden');
        loadProfile(item.getAttribute('data-username'));
      });
    });

    // Follow toggling inside modal
    DOM.usersModalList.querySelectorAll('.follow-toggle-modal').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const userId = btn.getAttribute('data-user-id');
        const username = btn.getAttribute('data-username');
        
        try {
          const result = await api.toggleFollow(userId);
          if (result.following) {
            btn.className = 'btn btn-secondary btn-sm follow-toggle-modal';
            btn.innerHTML = '<i data-lucide="user-check" style="width:12px; height:12px;"></i> Following';
          } else {
            btn.className = 'btn btn-primary btn-sm follow-toggle-modal';
            btn.innerHTML = '<i data-lucide="user-plus" style="width:12px; height:12px;"></i> Follow';
          }
          lucide.createIcons();
          
          // If viewing our own profile, follow action inside modal changes following count stats
          if (profileUsername === currentUser.username) {
            let followingCount = parseInt(DOM.statFollowing.textContent);
            DOM.statFollowing.textContent = result.following ? followingCount + 1 : Math.max(0, followingCount - 1);
          }
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });

  } catch (error) {
    DOM.usersModalList.innerHTML = `<p style="color:var(--danger); padding:20px 0;">Error: ${error.message}</p>`;
  }
}

DOM.btnCloseUsersModal.addEventListener('click', () => {
  DOM.usersModal.classList.add('hidden');
});

DOM.usersModal.addEventListener('click', (e) => {
  if (e.target === DOM.usersModal) DOM.usersModal.classList.add('hidden');
});

// ==========================================================================
// 8. Photo Input File Listeners & Form Submissions
// ==========================================================================

// Create Post: Image preview handlers
DOM.postImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('File size must be less than 5MB', 'error');
    DOM.postImageInput.value = '';
    return;
  }

  selectedPostImage = file;
  const reader = new FileReader();
  reader.onload = (event) => {
    DOM.postImagePreview.src = event.target.result;
    DOM.postImagePreviewContainer.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

DOM.removePreviewBtn.addEventListener('click', () => {
  selectedPostImage = null;
  DOM.postImageInput.value = '';
  DOM.postImagePreviewContainer.classList.add('hidden');
  DOM.postImagePreview.src = '';
});

// Create Post Form Submit
DOM.createPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = DOM.postContent.value.trim();
  if (!content) return;

  showLoading(true);
  try {
    await api.createPost(content, selectedPostImage);
    DOM.postContent.value = '';
    selectedPostImage = null;
    DOM.postImageInput.value = '';
    DOM.postImagePreviewContainer.classList.add('hidden');
    DOM.postImagePreview.src = '';
    
    showToast('Vibe shared successfully!', 'success');
    
    // Reload feed
    if (activeTab === 'feed') {
      await loadFeed();
    } else {
      await loadProfile(currentUser.username);
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Edit Profile Modal Trigger
DOM.btnEditProfile.addEventListener('click', () => {
  DOM.editBio.value = currentUser.bio || '';
  DOM.editAvatarPreview.src = getAvatarUrl(currentUser.avatar_url, currentUser.username);
  selectedAvatarImage = null;
  DOM.editAvatarInput.value = '';
  DOM.editProfileModal.classList.remove('hidden');
});

// Avatar Change Input
DOM.editAvatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast('Avatar file size must be less than 2MB', 'error');
    DOM.editAvatarInput.value = '';
    return;
  }

  selectedAvatarImage = file;
  const reader = new FileReader();
  reader.onload = (event) => {
    DOM.editAvatarPreview.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Cancel Profile Edit
function closeEditProfileModal() {
  DOM.editProfileModal.classList.add('hidden');
  selectedAvatarImage = null;
  DOM.editAvatarInput.value = '';
}

DOM.btnCloseEditModal.addEventListener('click', closeEditProfileModal);
DOM.btnCancelEditProfile.addEventListener('click', closeEditProfileModal);
DOM.editProfileModal.addEventListener('click', (e) => {
  if (e.target === DOM.editProfileModal) closeEditProfileModal();
});

// Edit Profile Form Submit
DOM.editProfileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bio = DOM.editBio.value.trim();

  showLoading(true);
  try {
    const result = await api.updateProfile(bio, selectedAvatarImage);
    currentUser = result.user;
    
    // Update local user cards
    DOM.sidebarAvatar.src = getAvatarUrl(currentUser.avatar_url, currentUser.username);
    DOM.postCreatorAvatar.src = getAvatarUrl(currentUser.avatar_url, currentUser.username);
    
    closeEditProfileModal();
    showToast('Profile updated successfully!', 'success');
    
    // Refresh currently loaded profile
    await loadProfile(currentUser.username);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Sidebar Profile Card Quick Navigation to Profile
DOM.sidebarUserCard.addEventListener('click', () => {
  navigateToTab('profile');
});

// Nav item routing triggers
DOM.navFeed.addEventListener('click', () => navigateToTab('feed'));
DOM.navProfile.addEventListener('click', () => navigateToTab('profile'));

// Create post trigger just focuses text input and scrolls to feed top
DOM.navCreatePost.addEventListener('click', () => {
  navigateToTab('feed');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  DOM.postContent.focus();
});

// Logout action
DOM.btnLogout.addEventListener('click', () => {
  if (!confirm('Are you sure you want to logout?')) return;
  api.setToken(null);
  currentUser = null;
  showToast('Logged out successfully', 'info');
  switchView('auth');
});

// ==========================================================================
// 9. Auth View Form Submissions & Switching
// ==========================================================================

// Switch forms
DOM.switchToRegister.addEventListener('click', () => {
  DOM.loginForm.classList.add('hidden');
  DOM.registerForm.classList.remove('hidden');
});
DOM.switchToLogin.addEventListener('click', () => {
  DOM.registerForm.classList.add('hidden');
  DOM.loginForm.classList.remove('remove'); // wait, let's look at registerForm.classList and loginForm
  DOM.loginForm.classList.remove('hidden');
});

// Login submit
DOM.loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usernameOrEmail = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!usernameOrEmail || !password) return;

  showLoading(true);
  try {
    const data = await api.login(usernameOrEmail, password);
    api.setToken(data.token);
    currentUser = data.user;
    
    // Clean inputs
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    showToast('Signed in successfully!', 'success');
    switchView('app');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Register submit
DOM.registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  if (!username || !email || !password) return;

  showLoading(true);
  try {
    const data = await api.register(username, email, password);
    api.setToken(data.token);
    currentUser = data.user;

    // Clean inputs
    document.getElementById('register-username').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';

    showToast('Account created successfully!', 'success');
    
    // Reset form view toggle
    DOM.registerForm.classList.add('hidden');
    DOM.loginForm.classList.remove('hidden');
    
    switchView('app');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// ==========================================================================
// 10. Application Initialization
// ==========================================================================

async function initializeApp() {
  lucide.createIcons();
  
  const token = api.getToken();
  if (!token) {
    switchView('auth');
    return;
  }

  showLoading(true);
  try {
    currentUser = await api.getMe();
    switchView('app');
  } catch (error) {
    console.error('Auto login failed:', error);
    api.setToken(null);
    switchView('auth');
  } finally {
    showLoading(false);
  }
}

// Kickstart
document.addEventListener('DOMContentLoaded', initializeApp);
