// results.js - REWRITE COMPLETE
const API_BASE = 'https://exam-system-backend.timacefest2025.workers.dev';

class ResultsSystem {
    constructor() {
        this.lomba = AuthSystem.getLomba();
        this.userData = AuthSystem.getUserData();
        this.leaderboard = [];
        this.personalResults = null;
    }

    async initialize() {
        console.log('📊 Initializing results system for:', this.lomba);
        
        // Validasi auth
        if (!this.validateAccess()) {
            return;
        }

        this.displayUserInfo();
        await this.loadPersonalResults();
        await this.loadLeaderboard();
        
        // Add CSS animations
        this.addResultsStyles();
    }

    validateAccess() {
        // Cek auth origin
        if (localStorage.getItem('auth_origin') !== 'exam_completed') {
            console.log('❌ Invalid access to results page');
            window.location.href = '../index.html';
            return false;
        }

        if (!AuthSystem.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }

        return true;
    }

    displayUserInfo() {
        const userInfo = document.getElementById('user-info');
        if (userInfo && this.userData) {
            userInfo.innerHTML = `
                <div style="text-align: center;">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${this.userData.nama}</h3>
                    <p style="margin: 5px 0; color: #7f8c8d;">${this.userData.sekolah}</p>
                    <p style="margin: 5px 0; color: #f39c12; font-weight: bold;">Lomba: ${this.userData.lomba}</p>
                </div>
            `;
        }
    }

    async loadPersonalResults() {
        // Load dari localStorage dulu
        const savedResults = localStorage.getItem('examResults');
        if (savedResults) {
            this.personalResults = JSON.parse(savedResults);
            this.displayPersonalResults();
        }

        // Refresh dari server untuk data terbaru
        await this.refreshResultsFromServer();
    }

    async refreshResultsFromServer() {
        try {
            const response = await fetch(`${API_BASE}/api/results/${this.lomba}`);
            const data = await response.json();

            if (data.success && data.leaderboard) {
                const serverResult = data.leaderboard.find(
                    result => result.username === this.userData.username
                );
                
                if (serverResult) {
                    this.personalResults = {
                        score: serverResult.score,
                        correct_count: serverResult.correct_count,
                        total_questions: serverResult.total_questions,
                        timeSpent: serverResult.time_spent,
                        submittedAt: serverResult.submitted_at,
                        userData: this.userData,
                        cloudflareSubmitted: true
                    };
                    
                    localStorage.setItem('examResults', JSON.stringify(this.personalResults));
                    this.displayPersonalResults();
                }
            }
        } catch (error) {
            console.error('Refresh results error:', error);
            // Tetap gunakan data localStorage jika gagal
        }
    }

    displayPersonalResults() {
        const personalResults = document.getElementById('personal-results');
        if (!personalResults || !this.personalResults) return;

        const results = this.personalResults;
        const percentage = ((results.score / results.total_questions) * 100).toFixed(1);
        
        // Determine grade color
        let gradeColor = '#e74c3c'; // red
        if (percentage >= 80) gradeColor = '#27ae60'; // green
        else if (percentage >= 60) gradeColor = '#f39c12'; // orange

        personalResults.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                margin-bottom: 30px;
            ">
                <h2 style="margin: 0 0 20px 0; font-size: 24px;">🎉 Hasil Ujian Anda</h2>
                
                <div style="font-size: 48px; font-weight: bold; margin: 20px 0; color: ${gradeColor};">
                    ${results.score.toFixed(2)}
                </div>
                
                <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; text-align: left;">
                        <div>
                            <strong>Jawaban Benar:</strong><br>
                            <span style="font-size: 18px;">${results.correct_count || 0}/${results.total_questions || 0}</span>
                        </div>
                        <div>
                            <strong>Persentase:</strong><br>
                            <span style="font-size: 18px;">${percentage}%</span>
                        </div>
                        <div>
                            <strong>Waktu:</strong><br>
                            <span style="font-size: 14px;">${this.formatTime(results.timeSpent || 0)}</span>
                        </div>
                        <div>
                            <strong>Status:</strong><br>
                            <span style="font-size: 14px; color: ${results.cloudflareSubmitted ? '#2ecc71' : '#e74c3c'}">
                                ${results.cloudflareSubmitted ? '✅ Tersimpan di Server' : '⚠️ Disimpan Lokal'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                    Disubmit pada: ${new Date(results.submittedAt).toLocaleString('id-ID')}
                </div>
            </div>
        `;
    }

    async loadLeaderboard() {
        try {
            console.log('📥 Loading leaderboard for:', this.lomba);
            
            const response = await fetch(`${API_BASE}/api/results/${this.lomba}`);
            const data = await response.json();

            if (data.success) {
                this.leaderboard = data.leaderboard || [];
                this.displayLeaderboard();
            } else {
                this.showError('Gagal memuat leaderboard');
            }
        } catch (error) {
            console.error('❌ Load leaderboard error:', error);
            this.showError('Gagal memuat leaderboard: ' + error.message);
            this.displayEmptyLeaderboard();
        }
    }

    displayLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.leaderboard.length === 0) {
            this.displayEmptyLeaderboard();
            return;
        }

        this.leaderboard.forEach((result, index) => {
            const row = document.createElement('tr');
            
            // Highlight current user
            if (result.username === this.userData?.username) {
                row.style.background = 'linear-gradient(135deg, #fff9e6 0%, #ffeb3b 100%)';
                row.style.fontWeight = 'bold';
            }

            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const timeSpent = this.formatTime(result.time_spent);
            const submittedAt = new Date(result.submitted_at).toLocaleString('id-ID');
            const percentage = ((result.score / result.total_questions) * 100).toFixed(1);

            row.innerHTML = `
                <td class="${rankClass}">
                    ${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                </td>
                <td>${result.nama}</td>
                <td>${result.sekolah}</td>
                <td><strong>${result.score.toFixed(2)}</strong></td>
                <td>${result.correct_count}/${result.total_questions}</td>
                <td>${percentage}%</td>
                <td>${timeSpent}</td>
                <td>${submittedAt}</td>
            `;
            tbody.appendChild(row);
        });
    }

    displayEmptyLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📝</div>
                        <h3 style="margin: 0 0 10px 0;">Belum Ada Hasil Ujian</h3>
                        <p>Leaderboard akan terisi setelah peserta mengirimkan jawaban mereka.</p>
                    </td>
                </tr>
            `;
        }
    }

    formatTime(seconds) {
        if (!seconds) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    addResultsStyles() {
        const styles = `
            <style>
                .rank-1 { background: linear-gradient(135deg, #FFD700 0%, #FFEC8B 100%) !important; font-weight: bold; }
                .rank-2 { background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%) !important; font-weight: bold; }
                .rank-3 { background: linear-gradient(135deg, #CD7F32 0%, #E8C8A9 100%) !important; font-weight: bold; }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    text-align: left;
                }
                
                td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #ecf0f1;
                }
                
                tr:hover {
                    background: #f8f9fa;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                #personal-results, table {
                    animation: fadeIn 0.6s ease-out;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize results system
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('results.html')) {
        console.log('🚀 Starting results system...');
        const resultsSystem = new ResultsSystem();
        resultsSystem.initialize();
    }
});