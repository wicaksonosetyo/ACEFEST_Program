// utils.js - REWRITE COMPLETE
class Utils {
    static formatTime(totalSeconds) {
        if (!totalSeconds && totalSeconds !== 0) return '00:00';
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    static formatTimeMs(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        return this.formatTime(totalSeconds);
    }

    static showLoading(message = 'Memuat...') {
        this.hideLoading();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
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
        
        document.body.appendChild(loadingDiv);
    }

    static hideLoading() {
        const existing = document.getElementById('loading-overlay');
        if (existing) {
            existing.remove();
        }
    }

    static showToast(message, type = 'info', duration = 3000) {
        // Remove existing toast
        const existingToast = document.getElementById('app-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = `toast toast-${type}`;
        
        const bgColor = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        }[type] || '#3498db';

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
            font-family: Arial, sans-serif;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }

    static confirmDialog(message, title = 'Konfirmasi') {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.id = 'confirm-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;
            
            dialog.innerHTML = `
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <h3 style="margin: 0 0 15px 0; color: #2c3e50;">${title}</h3>
                    <p style="margin: 0 0 25px 0; color: #555; line-height: 1.5;">${message}</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button id="confirm-cancel" style="
                            padding: 10px 20px;
                            background: #95a5a6;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">Batal</button>
                        <button id="confirm-ok" style="
                            padding: 10px 20px;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">OK</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            document.getElementById('confirm-ok').onclick = () => {
                dialog.remove();
                resolve(true);
            };
            
            document.getElementById('confirm-cancel').onclick = () => {
                dialog.remove();
                resolve(false);
            };
        });
    }

    static formatNumber(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static setQueryParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    }
}

// Add global CSS for animations
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }
    
    .loading-content {
        text-align: center;
        background: white;
        padding: 30px;
        border-radius: 10px;
        color: #333;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(globalStyles);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}