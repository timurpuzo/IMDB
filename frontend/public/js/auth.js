// Shared auth utilities used by all pages
let currentUser = null;

async function loadCurrentUser() {
  if (!getToken()) return null;
  try {
    const res = await api.getMe();
    currentUser = res.data;
    return currentUser;
  } catch {
    clearToken();
    currentUser = null;
    return null;
  }
}

function logout() {
  clearToken();
  currentUser = null;
  window.location.href = 'index.html';
}

function renderNavbar() {
  const nav = document.getElementById('navbar-links');
  if (!nav) return;

  if (currentUser) {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="watchlist.html">Watchlist</a>
      <a href="profile.html">Profile</a>
      ${currentUser.role === 'admin' ? '<a href="admin.html">Admin</a>' : ''}
      <button onclick="logout()">Logout</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }

  // Highlight active page
  const page = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach((a) => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

async function initPage() {
  await loadCurrentUser();
  renderNavbar();
}
