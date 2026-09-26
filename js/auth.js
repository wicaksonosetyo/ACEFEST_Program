// js/auth.js - Updated untuk semua lomba
const API_BASE = 'https://exam-system-backend.timacefest2025.workers.dev';

class AuthSystem {
    static async login(username, password) {
        try {
            console.log('🔐 Login attempt:', username);
            
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log('📨 Login response:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store user data
            this.storeUserData(data.user);
            
            // Redirect berdasarkan response dari server
            if (data.redirect_url) {
                console.log('🔄 Redirecting to:', data.redirect_url);
                window.location.href = data.redirect_url;
            } else {
                // Fallback redirect
                this.redirectToExam(data.user.lomba);
            }
            
        } catch (error) {
            console.error('❌ Login error:', error);
            this.showError(error.message);
            throw error;
        }
    }

    static storeUserData(userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user_name', userData.nama);
        localStorage.setItem('user_school', userData.sekolah);
        localStorage.setItem('user_lomba', userData.lomba);
        localStorage.setItem('login_time', new Date().toISOString());
        
        console.log('✅ User data stored:', userData);
    }

    static redirectToExam(lomba) {
        const redirectMap = {
            'olimpiade_ipa': './exams/exam_olimpiade_ipa.html',
            'olimpiade_math': './exams/exam_olimpiade_math.html',
            'olimpiade_ips': './exams/exam_olimpiade_ips.html',
            'olimpiade_pai': './exams/exam_olimpiade_pai.html',
            'lctp': './exams/exam_lctp.html',
            'olimpiade_ujicoba': './exams/exam_olimpiade_ujicoba.html',
            'mhq': './pengumpulan_mhq.html',
            'mtq': './pengumpulan_mtq.html',
            'story_telling': './pengumpulan_story_telling.html',
            'news_anchor': './pengumpulan_news_anchor.html',
            'desain_poster': './pengumpulan_desain_poster.html'
        };

        const redirectUrl = redirectMap[lomba] || './exams/exam_olimpiade_ipa.html';
        console.log('🔄 Fallback redirect to:', redirectUrl);
        window.location.href = redirectUrl;
    }

    static isAuthenticated() {
        return !!localStorage.getItem('user_data');
    }

    static getUserData() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    static getLomba() {
        return localStorage.getItem('user_lomba');
    }

    static logout() {
        const keysToRemove = [
            'user_data', 'user_id', 'username', 'user_name', 
            'user_school', 'user_lomba', 'login_time'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('🚪 User logged out');
        window.location.href = './index.html';
    }

    static showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } else {
            alert('Error: ' + message);
        }
    }
}

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = document.getElementById('loginButton');
            const loginText = document.getElementById('loginText');
            const loadingIndicator = document.getElementById('loadingIndicator');
            
            if (!username || !password) {
                AuthSystem.showError('Harap isi username dan password');
                return;
            }
            
            // Tampilkan loading
            loginText.style.display = 'none';
            loadingIndicator.style.display = 'block';
            submitBtn.disabled = true;
            
            try {
                await AuthSystem.login(username, password);
            } catch (error) {
                // Error sudah dihandle di AuthSystem.login()
            } finally {
                // Reset button state
                loginText.style.display = 'inline';
                loadingIndicator.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    // Auto-redirect jika sudah login
    const userData = AuthSystem.getUserData();
    if (userData && window.location.pathname.includes('index.html')) {
        console.log('🔄 Auto-redirecting logged in user');
        if (userData.lomba.includes('pengumpulan') || 
            ['mhq', 'mtq', 'story_telling', 'news_anchor', 'desain_poster'].includes(userData.lomba)) {
            AuthSystem.redirectToExam(userData.lomba);
        }
    }
});