
const ADMIN_CREDENTIALS = {
  username: 'novaadmin',
  password: 'nova@123'
};

// Current admin session
let currentAdmin = null;
let selectedMember = null;
function initAdminLogin() {
  const loginForm = document.getElementById('adminLoginForm');
  const passwordToggles = document.querySelectorAll('.toggle-password');

  // Password toggle
  passwordToggles.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;

    const submitBtn = loginForm.querySelector('.admin-login-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    submitBtn.disabled = true;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      currentAdmin = {
        username,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('novanexus_admin_session', JSON.stringify(currentAdmin));

      submitBtn.innerHTML = '<i class="fas fa-check"></i> Access Granted!';

      setTimeout(() => {
        showDashboard();
      }, 500);

    } else {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      alert('Invalid admin credentials. Please try again.');
      document.getElementById('admin-password').value = '';
    }
  });
}

function showDashboard() {
  document.getElementById('adminLoginScreen').classList.remove('active');
  document.getElementById('adminDashboard').classList.add('active');
  
  if (currentAdmin) {
    document.getElementById('adminNameDisplay').textContent = currentAdmin.username;
  }

  loadDashboardData();
}

function showLoginScreen() {
  document.getElementById('adminDashboard').classList.remove('active');
  document.getElementById('adminLoginScreen').classList.add('active');
  currentAdmin = null;
  localStorage.removeItem('novanexus_admin_session');
}

// ============================================
// DASHBOARD DATA LOADING
// ============================================

function loadDashboardData() {
  const users = loadUsers();
  
  // Update stats
  document.getElementById('totalMembers').textContent = users.length;
  
  const pendingUsers = users.filter(u => !u.verified);
  document.getElementById('pendingApprovals').textContent = pendingUsers.length;
  
  const verifiedUsers = users.filter(u => u.verified);
  document.getElementById('verifiedMembers').textContent = verifiedUsers.length;

  // Load tables
  loadMembersTable(users);
  loadPendingApprovals(pendingUsers);
  loadAnalytics(users);
}

function loadUsers() {
  const stored = localStorage.getItem('novanexus_users');
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem('novanexus_users', JSON.stringify(users));
}

// ============================================
// MEMBERS TABLE
// ============================================

function loadMembersTable(users) {
  const tbody = document.getElementById('membersTableBody');
  tbody.innerHTML = '';

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem; color: #666;">
          <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
          No members registered yet
        </td>
      </tr>
    `;
    return;
  }

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${user.rollno}</strong></td>
      <td>${user.firstname} ${user.lastname}</td>
      <td>${user.email}</td>
      <td>Year ${user.year}</td>
      <td>${formatDomain(user.domain)}</td>
      <td>
        <span class="status-badge ${user.verified ? 'verified' : 'pending'}">
          ${user.verified ? 'Verified' : 'Pending'}
        </span>
      </td>
      <td>${formatDate(user.registeredAt)}</td>
      <td class="action-btns">
        <button onclick="viewMemberDetails('${user.id}')" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="delete" onclick="deleteMemberConfirm('${user.id}')" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function formatDomain(domain) {
  const domains = {
    'embedded': 'Embedded Systems',
    'vlsi': 'VLSI Design',
    'iot': 'IoT',
    'communications': 'Communications',
    'signal': 'Signal Processing',
    'robotics': 'Robotics',
    'ai': 'AI/ML in ECE'
  };
  return domains[domain] || domain;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ============================================
// MEMBER SEARCH
// ============================================

function initMemberSearch() {
  const searchInput = document.getElementById('memberSearch');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const users = loadUsers();
    
    const filtered = users.filter(user => {
      return (
        user.firstname.toLowerCase().includes(searchTerm) ||
        user.lastname.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.rollno.toLowerCase().includes(searchTerm) ||
        formatDomain(user.domain).toLowerCase().includes(searchTerm)
      );
    });
    
    loadMembersTable(filtered);
  });
}

// ============================================
// PENDING APPROVALS
// ============================================

function loadPendingApprovals(pendingUsers) {
  const container = document.getElementById('pendingList');
  container.innerHTML = '';

  if (pendingUsers.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #666;">
        <i class="fas fa-check-circle" style="font-size: 4rem; margin-bottom: 1rem; display: block; color: #44ff44;"></i>
        <h3>All Caught Up!</h3>
        <p>No pending member approvals</p>
      </div>
    `;
    return;
  }

  pendingUsers.forEach(user => {
    const card = document.createElement('div');
    card.className = 'pending-card';
    card.innerHTML = `
      <div style="flex: 1;">
        <h3>${user.firstname} ${user.lastname}</h3>
        <p><strong>Roll No:</strong> ${user.rollno}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Domain:</strong> ${formatDomain(user.domain)}</p>
        <p><strong>Registered:</strong> ${formatDate(user.registeredAt)}</p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="action-btn verify" onclick="approveMember('${user.id}')">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="action-btn delete" onclick="rejectMember('${user.id}')">
          <i class="fas fa-times"></i> Reject
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function approveMember(userId) {
  if (!confirm('Approve this member?')) return;

  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.verified = true;
    user.verifiedAt = new Date().toISOString();
    user.verifiedBy = currentAdmin.username;
    saveUsers(users);
    
    alert(`${user.firstname} ${user.lastname} has been approved!`);
    loadDashboardData();
  }
}

function rejectMember(userId) {
  if (!confirm('Reject and delete this member application?')) return;

  let users = loadUsers();
  users = users.filter(u => u.id !== userId);
  saveUsers(users);
  
  alert('Member application rejected');
  loadDashboardData();
}

// ============================================
// MEMBER DETAILS MODAL
// ============================================

function viewMemberDetails(userId) {
  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;

  selectedMember = user;

  document.getElementById('memberDetailName').textContent = `${user.firstname} ${user.lastname}`;
  document.getElementById('memberDetailRoll').textContent = user.rollno;
  document.getElementById('memberDetailEmail').textContent = user.email;
  document.getElementById('memberDetailPhone').textContent = user.phone;
  document.getElementById('memberDetailYear').textContent = `Year ${user.year}`;
  document.getElementById('memberDetailDomain').textContent = formatDomain(user.domain);
  document.getElementById('memberDetailDate').textContent = formatDate(user.registeredAt);
  document.getElementById('memberDetailId').textContent = user.id;

  const statusBadge = document.getElementById('memberDetailStatus');
  statusBadge.className = `status-badge ${user.verified ? 'verified' : 'pending'}`;
  statusBadge.textContent = user.verified ? 'Verified' : 'Pending';

  document.getElementById('memberDetailModal').classList.add('active');
}

function closeMemberModal() {
  document.getElementById('memberDetailModal').classList.remove('active');
  selectedMember = null;
}

function verifyMember() {
  if (!selectedMember) return;

  if (!confirm(`Verify ${selectedMember.firstname} ${selectedMember.lastname}?`)) return;

  const users = loadUsers();
  const user = users.find(u => u.id === selectedMember.id);
  
  if (user) {
    user.verified = true;
    user.verifiedAt = new Date().toISOString();
    user.verifiedBy = currentAdmin.username;
    saveUsers(users);
    
    alert('Member verified successfully!');
    closeMemberModal();
    loadDashboardData();
  }
}

function sendEmail() {
  if (!selectedMember) return;
  
  const subject = encodeURIComponent('Nova Nexus Club - Welcome!');
  const body = encodeURIComponent(`Dear ${selectedMember.firstname},\n\nWelcome to Nova Nexus Club!\n\nBest regards,\nNova Nexus Admin Team`);
  
  window.open(`mailto:${selectedMember.email}?subject=${subject}&body=${body}`);
}

function deleteMember() {
  if (!selectedMember) return;

  if (!confirm(`Delete ${selectedMember.firstname} ${selectedMember.lastname}? This action cannot be undone.`)) return;

  let users = loadUsers();
  users = users.filter(u => u.id !== selectedMember.id);
  saveUsers(users);
  
  alert('Member deleted successfully');
  closeMemberModal();
  loadDashboardData();
}

function deleteMemberConfirm(userId) {
  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;

  if (!confirm(`Delete ${user.firstname} ${user.lastname}? This action cannot be undone.`)) return;

  const filtered = users.filter(u => u.id !== userId);
  saveUsers(filtered);
  
  alert('Member deleted successfully');
  loadDashboardData();
}

// ============================================
// TAB SWITCHING
// ============================================

function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${targetTab}Tab`).classList.add('active');

      // Reload data when switching tabs
      if (targetTab === 'members') {
        loadMembersTable(loadUsers());
      } else if (targetTab === 'pending') {
        const users = loadUsers();
        const pending = users.filter(u => !u.verified);
        loadPendingApprovals(pending);
      } else if (targetTab === 'analytics') {
        loadAnalytics(loadUsers());
      }
    });
  });
}

// ============================================
// ANALYTICS
// ============================================

function loadAnalytics(users) {
  // Update verification counts
  const verified = users.filter(u => u.verified).length;
  const unverified = users.filter(u => !u.verified && u.role !== 'pending').length;
  const pending = users.filter(u => !u.verified).length;

  document.getElementById('verifiedCount').textContent = verified;
  document.getElementById('unverifiedCount').textContent = unverified;
  document.getElementById('pendingCount').textContent = pending;

  // Calculate statistics
  const yearStats = calculateYearStats(users);
  const domainStats = calculateDomainStats(users);

  // Display in simple format (charts would require Chart.js library)
  displayYearStats(yearStats);
  displayDomainStats(domainStats);
}

function calculateYearStats(users) {
  const stats = { '1': 0, '2': 0, '3': 0, '4': 0 };
  users.forEach(user => {
    if (stats[user.year] !== undefined) {
      stats[user.year]++;
    }
  });
  return stats;
}

function calculateDomainStats(users) {
  const stats = {};
  users.forEach(user => {
    const domain = formatDomain(user.domain);
    stats[domain] = (stats[domain] || 0) + 1;
  });
  return stats;
}

function displayYearStats(stats) {
  const canvas = document.getElementById('yearChart');
  const ctx = canvas.getContext('2d');
  
  // Simple text display (replace with actual chart library)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '16px Arial';
  ctx.fillStyle = '#333';
  
  let y = 30;
  Object.entries(stats).forEach(([year, count]) => {
    ctx.fillText(`Year ${year}: ${count} members`, 20, y);
    y += 30;
  });
}

function displayDomainStats(stats) {
  const canvas = document.getElementById('domainChart');
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '14px Arial';
  ctx.fillStyle = '#333';
  
  let y = 25;
  Object.entries(stats).forEach(([domain, count]) => {
    ctx.fillText(`${domain}: ${count}`, 20, y);
    y += 25;
  });
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

function initExport() {
  const exportBtns = document.querySelectorAll('.export-btn');
  
  exportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      exportToCSV();
    });
  });
}

function exportToCSV() {
  const users = loadUsers();
  
  if (users.length === 0) {
    alert('No data to export');
    return;
  }

  let csv = 'Roll No,First Name,Last Name,Email,Phone,Year,Domain,Status,Registered Date\n';
  
  users.forEach(user => {
    csv += `${user.rollno},${user.firstname},${user.lastname},${user.email},${user.phone},${user.year},${formatDomain(user.domain)},${user.verified ? 'Verified' : 'Pending'},${formatDate(user.registeredAt)}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `novanexus_members_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// ============================================
// LOGOUT
// ============================================

function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      showLoginScreen();
    }
  });
}



function checkAdminSession() {
  const stored = localStorage.getItem('novanexus_admin_session');
  
  if (stored) {
    currentAdmin = JSON.parse(stored);
    
    // Check if session is still valid (24 hours)
    const loginTime = new Date(currentAdmin.loginTime);
    const now = new Date();
    const hoursPassed = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursPassed < 24) {
      showDashboard();
    } else {
      localStorage.removeItem('novanexus_admin_session');
      document.getElementById('adminLoginScreen').classList.add('active');
    }
  } else {
    document.getElementById('adminLoginScreen').classList.add('active');
  }
}


function initSettings() {
  const changePasswordForm = document.getElementById('changePasswordForm');
  
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Password change functionality would be implemented with backend');
    });
  }

  // Initialize switches
  const switches = document.querySelectorAll('.switch-label input[type="checkbox"]');
  switches.forEach(sw => {
    sw.addEventListener('change', () => {
      console.log('Setting changed:', sw.checked);
    });
  });
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Admin Panel Loaded');
  
  initAdminLogin();
  initTabs();
  initMemberSearch();
  initExport();
  initLogout();
  initSettings();
  checkAdminSession();
});

// Make functions globally accessible
window.viewMemberDetails = viewMemberDetails;
window.closeMemberModal = closeMemberModal;
window.verifyMember = verifyMember;
window.sendEmail = sendEmail;
window.deleteMember = deleteMember;
window.deleteMemberConfirm = deleteMemberConfirm;
window.approveMember = approveMember;
window.rejectMember = rejectMember;