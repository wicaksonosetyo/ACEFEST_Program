// exam.js - REWRITE COMPLETE dengan perbaikan scoring
const API_BASE = 'https://exam-system-backend.timacefest2025.workers.dev';

class ExamSystem {
    constructor() {
        this.questions = [];
        this.userAnswers = {};
        this.startTime = null;
        this.duration = 2 * 60 * 60 * 1000; // 2 jam
        this.timerInterval = null;
        this.lomba = AuthSystem.getLomba();
        this.userData = AuthSystem.getUserData();
        this.isSubmitting = false;
        this.examCompleted = false;
    }

    async initialize() {
        console.log('🎯 Initializing exam system for:', this.lomba);
        
        if (!this.validateAccess()) {
            return;
        }

        // Cek apakah sudah pernah submit
        const hasSubmitted = await AuthSystem.checkExistingSubmission();
        if (hasSubmitted) {
            this.showAlreadySubmittedWarning();
            return;
        }

        await this.loadQuestionsFromAPI();
        this.startTimer();
        this.setupEventListeners();
        this.updateUserInfo();
        this.setupBackButtonProtection();
        
        console.log('✅ Exam system initialized successfully');
    }

    validateAccess() {
        // Cek auth origin
        if (localStorage.getItem('auth_origin') !== 'exam_portal') {
            console.log('❌ Invalid access to exam page');
            window.location.href = '../index.html';
            return false;
        }

        if (!AuthSystem.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }

        return true;
    }

    async loadQuestionsFromAPI() {
        try {
            console.log('📥 Loading questions for lomba:', this.lomba);
            
            const response = await fetch(`${API_BASE}/api/questions?lomba=${this.lomba}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Gagal memuat soal');
            }

            this.questions = data.questions;
            console.log(`✅ Loaded ${this.questions.length} questions`);
            
            // Initialize userAnswers
            this.questions.forEach((question, index) => {
                this.userAnswers[index] = null;
            });
            
            this.renderQuestions();
            this.preloadImages();
            
        } catch (error) {
            console.error('❌ Load questions error:', error);
            this.showError('Gagal memuat soal: ' + error.message);
        }
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        if (!container) {
            console.error('❌ Questions container not found');
            return;
        }
        
        container.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const questionElement = this.createQuestionElement(question, index);
            container.appendChild(questionElement);
        });
        
        this.updateProgress();
    }

    createQuestionElement(question, questionIndex) {
        const div = document.createElement('div');
        div.className = 'question-card';
        div.id = `question-${questionIndex}`;
        
        let imageHTML = '';
        if (question.gambar) {
            const imageUrl = `${API_BASE}/api/images/${question.gambar}`;
            imageHTML = `
                <div class="question-image">
                    <img src="${imageUrl}" alt="Gambar soal ${questionIndex + 1}" 
                         onerror="this.style.display='none'" 
                         loading="lazy">
                </div>
            `;
        }
        
        div.innerHTML = `
            <div class="question-header">
                <h3>Soal ${questionIndex + 1}</h3>
                <div class="question-status" id="status-${questionIndex}">
                    ${this.userAnswers[questionIndex] ? '✅ Terjawab' : '⏳ Belum dijawab'}
                </div>
            </div>
            <div class="question-text">${question.question_text}</div>
            ${imageHTML}
            <div class="options">
                <label class="option ${this.userAnswers[questionIndex] === 'A' ? 'selected' : ''}">
                    <input type="radio" name="question_${questionIndex}" value="A" 
                           ${this.userAnswers[questionIndex] === 'A' ? 'checked' : ''}>
                    <span class="option-label">A.</span>
                    <span class="option-text">${question.option_a}</span>
                </label>
                <label class="option ${this.userAnswers[questionIndex] === 'B' ? 'selected' : ''}">
                    <input type="radio" name="question_${questionIndex}" value="B"
                           ${this.userAnswers[questionIndex] === 'B' ? 'checked' : ''}>
                    <span class="option-label">B.</span>
                    <span class="option-text">${question.option_b}</span>
                </label>
                <label class="option ${this.userAnswers[questionIndex] === 'C' ? 'selected' : ''}">
                    <input type="radio" name="question_${questionIndex}" value="C"
                           ${this.userAnswers[questionIndex] === 'C' ? 'checked' : ''}>
                    <span class="option-label">C.</span>
                    <span class="option-text">${question.option_c}</span>
                </label>
                <label class="option ${this.userAnswers[questionIndex] === 'D' ? 'selected' : ''}">
                    <input type="radio" name="question_${questionIndex}" value="D"
                           ${this.userAnswers[questionIndex] === 'D' ? 'checked' : ''}>
                    <span class="option-label">D.</span>
                    <span class="option-text">${question.option_d}</span>
                </label>
            </div>
        `;
        
        // Add event listeners untuk radio buttons
        const radioButtons = div.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setAnswer(questionIndex, e.target.value);
            });
        });
        
        return div;
    }

    setAnswer(questionIndex, answer) {
        this.userAnswers[questionIndex] = answer;
        this.updateQuestionStatus(questionIndex);
        this.updateProgress();
        this.saveProgress();
        
        console.log(`📝 Jawaban soal ${questionIndex + 1}: ${answer}`);
    }

    updateQuestionStatus(questionIndex) {
        const statusElement = document.getElementById(`status-${questionIndex}`);
        if (statusElement) {
            statusElement.textContent = this.userAnswers[questionIndex] ? '✅ Terjawab' : '⏳ Belum dijawab';
        }
        
        // Update visual selected option
        const options = document.querySelectorAll(`#question-${questionIndex} .option`);
        options.forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`#question-${questionIndex} input:checked`);
        if (selectedOption) {
            selectedOption.parentElement.classList.add('selected');
        }
    }

    updateProgress() {
        const answered = Object.values(this.userAnswers).filter(answer => answer !== null).length;
        const total = this.questions.length;
        const progress = (answered / total) * 100;
        
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Terjawab: ${answered}/${total}`;
    }

    startTimer() {
        this.startTime = Date.now();
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
            this.checkTimeLimit();
        }, 1000);
    }

    updateTimerDisplay() {
        const elapsed = Date.now() - this.startTime;
        const remaining = this.duration - elapsed;
        
        if (remaining <= 0) {
            this.autoSubmitExam();
            return;
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning ketika sisa 5 menit
            if (remaining <= 5 * 60 * 1000) {
                timerElement.classList.add('warning');
            }
        }
    }

    checkTimeLimit() {
        const elapsed = Date.now() - this.startTime;
        if (elapsed >= this.duration) {
            this.autoSubmitExam();
        }
    }

    async submitExam() {
        if (this.isSubmitting || this.examCompleted) {
            console.log('⏳ Already submitting, skipping...');
            return;
        }
        
        this.isSubmitting = true;
        this.examCompleted = true;
        console.log('🚀 Starting exam submission...');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Show submitting overlay
        this.showSubmittingOverlay();

        try {
            const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
            
            // Format answers untuk dikirim ke server
            const answersData = {};
            this.questions.forEach((question, index) => {
                answersData[question.id] = this.userAnswers[index] || '-';
            });

            console.log('📤 Submission data:', {
                user: this.userData.username,
                answers: answersData,
                timeSpent: timeSpent
            });

            const response = await fetch(`${API_BASE}/api/exams/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    username: this.userData.username,
                    nama: this.userData.nama,
                    sekolah: this.userData.sekolah,
                    lomba: this.userData.lomba,
                    answers: answersData,
                    time_spent: timeSpent
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Gagal menyimpan hasil ujian');
            }
            
            console.log('✅ Exam submitted successfully:', result);
            
            // Simpan hasil ke localStorage untuk results page
            const examResults = {
                score: result.score || 0,
                correct_count: result.correct_count || 0,
                total_questions: result.total_questions || this.questions.length,
                timeSpent: timeSpent,
                submittedAt: new Date().toISOString(),
                userData: this.userData,
                cloudflareSubmitted: true,
                serverResponse: result
            };
            
            localStorage.setItem('examResults', JSON.stringify(examResults));
            localStorage.setItem('auth_origin', 'exam_completed');
            
            // Clear progress
            localStorage.removeItem('examProgress');
            
            // Redirect ke results page
            setTimeout(() => {
                window.location.href = './results.html';
            }, 3000);
            
        } catch (error) {
            console.error('❌ Submit error:', error);
            this.showError('Gagal mengirim jawaban: ' + error.message);
            
            // Fallback: save to localStorage
            this.saveOfflineResults();
        }
    }

    autoSubmitExam() {
        console.log('⏰ Waktu habis, auto-submitting...');
        this.showTimeUpWarning();
        this.submitExam();
    }

    saveOfflineResults() {
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        
        const examResults = {
            score: 0, // Tidak bisa menghitung tanpa kunci jawaban
            correct_count: 0,
            total_questions: this.questions.length,
            timeSpent: timeSpent,
            submittedAt: new Date().toISOString(),
            userData: this.userData,
            cloudflareSubmitted: false,
            offline: true,
            userAnswers: this.userAnswers
        };
        
        localStorage.setItem('examResults', JSON.stringify(examResults));
        localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
        localStorage.setItem('auth_origin', 'exam_completed');
        
        console.log('💾 Results saved offline');
        
        this.showError('Jawaban disimpan secara offline. Silakan hubungi panitia.');
        
        setTimeout(() => {
            window.location.href = './results.html';
        }, 5000);
    }

    saveProgress() {
        const progress = {
            userAnswers: this.userAnswers,
            startTime: this.startTime,
            timestamp: Date.now()
        };
        
        localStorage.setItem('examProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('examProgress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                
                // Cek jika progress tidak terlalu lama (max 4 jam)
                if (Date.now() - progress.timestamp < 4 * 60 * 60 * 1000) {
                    this.userAnswers = progress.userAnswers || {};
                    this.startTime = progress.startTime || Date.now();
                    return true;
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
        return false;
    }

    setupEventListeners() {
        const submitBtn = document.getElementById('submit-exam');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const answered = Object.values(this.userAnswers).filter(answer => answer !== null).length;
                const total = this.questions.length;
                
                if (answered < total) {
                    const confirmSubmit = confirm(
                        `Anda baru menjawab ${answered} dari ${total} soal. Yakin ingin submit?`
                    );
                    if (!confirmSubmit) return;
                }
                
                const finalConfirm = confirm(
                    'Apakah Anda yakin ingin mengirim jawaban? Setelah dikirim tidak dapat diubah.'
                );
                if (finalConfirm) {
                    this.submitExam();
                }
            });
        }

        // Auto-save progress sebelum unload
        window.addEventListener('beforeunload', (e) => {
            if (!this.isSubmitting && !this.examCompleted) {
                this.saveProgress();
            }
        });
    }

    setupBackButtonProtection() {
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', () => {
            if (!this.isSubmitting && !this.examCompleted) {
                window.history.pushState(null, null, window.location.href);
                this.showError('Tombol back dinonaktifkan selama ujian.');
            }
        });
    }

    updateUserInfo() {
        const userInfo = document.getElementById('user-info');
        if (userInfo && this.userData) {
            userInfo.innerHTML = `
                <strong>${this.userData.nama}</strong><br>
                ${this.userData.sekolah}<br>
                Lomba: ${this.userData.lomba}
            `;
        }
    }

    preloadImages() {
        this.questions.forEach((question) => {
            if (question.gambar) {
                const img = new Image();
                img.src = `${API_BASE}/api/images/${question.gambar}`;
            }
        });
    }

    showSubmittingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'submitting-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; background: white; padding: 40px; border-radius: 10px; color: #333;">
                <div class="spinner" style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <h2>Mengirim Jawaban...</h2>
                <p>Harap tunggu, jawaban Anda sedang dikirim ke server.</p>
                <p style="font-size: 14px; color: #666;">Halaman akan otomatis dialihkan ke hasil ujian.</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    showTimeUpWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(231, 76, 60, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
        `;
        
        warning.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 10px; color: #e74c3c;">
                <h2>⏰ Waktu Ujian Telah Habis</h2>
                <p>Jawaban Anda akan otomatis dikirim...</p>
                <div class="spinner" style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #e74c3c;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                "></div>
            </div>
        `;
        
        document.body.appendChild(warning);
    }

    showAlreadySubmittedWarning() {
        const warningHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    text-align: center;
                    max-width: 500px;
                    margin: 20px;
                ">
                    <h2 style="color: #e74c3c; margin-bottom: 20px;">⛔ Akses Ditolak</h2>
                    <p style="margin-bottom: 20px; line-height: 1.6;">
                        <strong>Anda sudah menyelesaikan ujian ini!</strong><br>
                        Tidak dapat mengulang ujian yang sudah disubmit.
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="window.location.href='./results.html'" 
                                style="padding: 12px 24px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            📊 Lihat Hasil
                        </button>
                        <button onclick="AuthSystem.logout()" 
                                style="padding: 12px 24px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', warningHTML);
    }

    showError(message) {
        // Remove existing error
        const existingError = document.getElementById('exam-error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.id = 'exam-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize exam system
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('exam_')) {
        console.log('🚀 Starting exam system...');
        const examSystem = new ExamSystem();
        
        // Load progress terlebih dahulu
        if (examSystem.loadProgress()) {
            console.log('📁 Loaded saved progress');
        }
        
        examSystem.initialize();
    }
});