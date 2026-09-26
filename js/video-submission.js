// js/video-submission.js - Sistem Pengumpulan Video
const API_BASE = 'https://exam-system-backend.timacefest2025.workers.dev';

class VideoSubmissionSystem {
    constructor() {
        this.userData = null;
        this.lomba = this.getLombaFromPage();
        this.hasSubmitted = false;
    }

    getLombaFromPage() {
        const path = window.location.pathname;
        if (path.includes('pengumpulan_mhq')) return 'mhq';
        if (path.includes('pengumpulan_mtq')) return 'mtq';
        if (path.includes('pengumpulan_story_telling')) return 'story_telling';
        if (path.includes('pengumpulan_news_anchor')) return 'news_anchor';
        return null;
    }

    async initialize() {
        if (!this.validateAccess()) {
            return;
        }

        await this.loadUserData();
        this.displayUserInfo();
        await this.checkExistingSubmission();
        this.setupEventListeners();
        
        console.log('✅ Video submission system initialized for:', this.lomba);
    }

    validateAccess() {
        this.userData = JSON.parse(localStorage.getItem('user_data'));
        
        if (!this.userData) {
            alert('Sesi telah berakhir. Silakan login kembali.');
            window.location.href = '../index.html';
            return false;
        }

        // Validasi lomba
        const userLomba = this.userData.lomba.toLowerCase();
        const pageLomba = this.lomba;

        if (userLomba !== pageLomba) {
            alert(`Akses ditolak. Hanya peserta ${pageLomba} yang dapat mengakses halaman ini.`);
            window.location.href = '../index.html';
            return false;
        }

        return true;
    }

    async loadUserData() {
        console.log('✅ User data loaded:', this.userData);
    }

    displayUserInfo() {
        const headerHTML = `
            <div class="user-info" style="
                display: flex; 
                align-items: center; 
                gap: 15px; 
                color: white;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
                backdrop-filter: blur(10px);
            ">
                <div class="user-avatar" style="
                    width: 50px; 
                    height: 50px; 
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-weight: bold; 
                    font-size: 20px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                ">
                    ${this.userData.nama.charAt(0).toUpperCase()}
                </div>
                <div class="user-details">
                    <div class="user-name" style="font-weight: 600; font-size: 16px;">${this.userData.nama}</div>
                    <div class="user-school" style="font-size: 14px; opacity: 0.9;">${this.userData.sekolah}</div>
                    <div class="user-lomba" style="font-size: 12px; opacity: 0.7; margin-top: 2px;">Lomba: ${this.userData.lomba}</div>
                </div>
            </div>
        `;

        const leftPanel = document.querySelector('.left-panel');
        const existingUserInfo = leftPanel.querySelector('.user-info');
        const competitionInfo = leftPanel.querySelector('.competition-info');
        
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        
        // Sisipkan sebelum competition info
        if (competitionInfo) {
            leftPanel.insertBefore(this.createElementFromHTML(headerHTML), competitionInfo);
        } else {
            // Jika tidak ada competition info, sisipkan di awal
            const firstChild = leftPanel.firstChild;
            leftPanel.insertBefore(this.createElementFromHTML(headerHTML), firstChild);
        }
    }

    async checkExistingSubmission() {
        try {
            const response = await fetch(`${API_BASE}/api/videos/check?user_id=${this.userData.id}&lomba=${this.lomba}`);
            const data = await response.json();

            if (data.success) {
                this.hasSubmitted = data.has_submitted;
                
                if (this.hasSubmitted) {
                    this.showAlreadySubmittedWarning(data.submission);
                }
            }
        } catch (error) {
            console.error('Error checking submission:', error);
        }
    }

    showAlreadySubmittedWarning(submission) {
        const warningHTML = `
            <div class="alert alert-warning" style="
                background: #fff3cd;
                color: #856404;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                border-left: 4px solid #ffc107;
                animation: slideDown 0.5s ease-out;
            ">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <i class="fas fa-check-circle" style="color: #28a745;"></i>
                    <strong>Video Sudah Dikirim</strong>
                </div>
                <p style="margin: 5px 0;">Anda sudah mengirimkan video untuk lomba ini.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <strong>Judul:</strong> ${submission.video_title}<br>
                    <strong>Link:</strong> <a href="${submission.youtube_link}" target="_blank" style="color: #007bff;">${submission.youtube_link}</a><br>
                    <strong>Dikirim:</strong> ${new Date(submission.submitted_at).toLocaleString('id-ID')}
                </div>
            </div>
        `;

        const form = document.getElementById('video-form');
        if (form) {
            form.style.display = 'none';
        }

        const rightPanel = document.querySelector('.right-panel');
        const cardTitle = rightPanel.querySelector('.card-title');
        
        if (cardTitle) {
            cardTitle.insertAdjacentHTML('afterend', warningHTML);
        }
    }

    setupEventListeners() {
        const form = document.getElementById('video-form');
        if (form && !this.hasSubmitted) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Character count
        const youtubeLink = document.getElementById('youtube-link');
        const videoTitle = document.getElementById('video-title');

        if (youtubeLink) {
            youtubeLink.addEventListener('input', this.updateCharacterCount.bind(this, 'link-count', 100));
        }
        if (videoTitle) {
            videoTitle.addEventListener('input', this.updateCharacterCount.bind(this, 'title-count', 50));
        }

        // YouTube preview
        if (youtubeLink) {
            youtubeLink.addEventListener('blur', this.previewYouTubeVideo.bind(this));
        }
    }

    updateCharacterCount(counterId, maxLength) {
        const input = event.target;
        const counter = document.getElementById(counterId);
        const count = input.value.length;
        
        counter.textContent = `${count}/${maxLength}`;
        
        if (count > maxLength) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    previewYouTubeVideo() {
        const link = event.target.value;
        if (link.includes('youtube.com') || link.includes('youtu.be')) {
            let videoId = '';
            
            if (link.includes('youtube.com')) {
                videoId = link.split('v=')[1];
                const ampersandPosition = videoId.indexOf('&');
                if (ampersandPosition !== -1) {
                    videoId = videoId.substring(0, ampersandPosition);
                }
            } else if (link.includes('youtu.be')) {
                videoId = link.split('/').pop();
            }
            
            if (videoId) {
                const preview = document.getElementById('video-preview');
                const frame = document.getElementById('preview-frame');
                frame.src = `https://www.youtube.com/embed/${videoId}`;
                preview.style.display = 'block';
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const youtubeLink = document.getElementById('youtube-link').value;
        const videoTitle = document.getElementById('video-title').value;
        
        if (!youtubeLink || !videoTitle) {
            this.showError('Harap isi link YouTube dan judul video.');
            return;
        }

        // Validasi YouTube link
        if (!youtubeLink.includes('youtube.com') && !youtubeLink.includes('youtu.be')) {
            this.showError('Harap masukkan link YouTube yang valid.');
            return;
        }

        // Show loading
        this.showLoading('Mengirim video...');

        try {
            const response = await fetch(`${API_BASE}/api/videos/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    username: this.userData.username,
                    nama: this.userData.nama,
                    sekolah: this.userData.sekolah,
                    lomba: this.lomba,
                    youtube_link: youtubeLink,
                    video_title: videoTitle
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess('Video berhasil dikirim!');
                this.hasSubmitted = true;
                
                // Reset form
                document.getElementById('video-form').reset();
                document.getElementById('video-preview').style.display = 'none';
                
                // Show confetti
                this.createConfetti();
                
                // Reload page after 3 seconds to show warning
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
                
            } else {
                this.showError(result.error || 'Gagal mengirim video.');
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            this.showError('Gagal mengirim video: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    showLoading(message = 'Memuat...') {
        this.hideLoading();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'video-loading-overlay';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        loadingDiv.innerHTML = `
            <div style="text-align: center; background: white; padding: 30px; border-radius: 10px; color: #333;">
                <div class="spinner" style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const existing = document.getElementById('video-loading-overlay');
        if (existing) {
            existing.remove();
        }
    }

    showSuccess(message) {
        const successAlert = document.getElementById('success-alert');
        if (successAlert) {
            successAlert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            successAlert.style.display = 'block';
            
            const errorAlert = document.getElementById('error-alert');
            if (errorAlert) {
                errorAlert.style.display = 'none';
            }
        }
    }

    showError(message) {
        const errorAlert = document.getElementById('error-alert');
        if (errorAlert) {
            errorAlert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            errorAlert.style.display = 'block';
            
            const successAlert = document.getElementById('success-alert');
            if (successAlert) {
                successAlert.style.display = 'none';
            }
        }
    }

    createConfetti() {
        const container = document.getElementById('confetti-container');
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#FFFFFF'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.opacity = '1';
            
            container.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${Math.random() * 300 + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }

    createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
}

// Initialize video submission system
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('pengumpulan_')) {
        console.log('🚀 Starting video submission system...');
        const videoSystem = new VideoSubmissionSystem();
        videoSystem.initialize();
    }
});