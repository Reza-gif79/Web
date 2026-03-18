/**
 * Seduulur Alumni - Authentication
 */

// Check auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePassword.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Check if already logged in (for admin pages)
    if (window.location.pathname.includes('admin.html') || window.location.href.includes('admin.html')) {
        checkAdminAuth();
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="remember"]')?.checked;
    
    console.log('Login attempt:', username);
    
    // Verify credentials
    const admin = verifyAdmin(username, password);
    console.log('Admin found:', admin);
    
    if (admin) {
        // Create session
        const session = {
            id: admin.id,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            loginTime: new Date().toISOString()
        };
        
        if (remember) {
            localStorage.setItem('adminSession', JSON.stringify(session));
        } else {
            sessionStorage.setItem('adminSession', JSON.stringify(session));
        }
        
        console.log('Login successful, redirecting...');
        // Redirect to admin
        window.location.href = 'admin.html';
    } else {
        console.log('Login failed');
        // Show error
        showLoginError('Username atau password salah');
    }
}

// Show Login Error
function showLoginError(message) {
    const toast = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    if (toast) {
        toast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
}

// Close Toast
function closeToast() {
    const toast = document.getElementById('loginError');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Check Admin Auth
function checkAdminAuth() {
    const session = getAdminSession();
    
    if (!session) {
        // Redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Update admin name in sidebar
    const adminName = document.getElementById('adminName');
    if (adminName) {
        adminName.textContent = session.name;
    }
}

// Get Admin Session
function getAdminSession() {
    let session = localStorage.getItem('adminSession');
    if (!session) {
        session = sessionStorage.getItem('adminSession');
    }
    
    return session ? JSON.parse(session) : null;
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();
    
    // Clear session
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSession');
    
    // Redirect to login
    window.location.href = 'login.html';
}

// Check if user is logged in (for public functions)
function isLoggedIn() {
    return getAdminSession() !== null;
}

// Get current admin
function getCurrentAdmin() {
    return getAdminSession();
}