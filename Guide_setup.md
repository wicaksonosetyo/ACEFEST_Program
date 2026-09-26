# 🎓 Tutorial: Cara Membuat Sistem Exam Online Seperti ACEFEST 2025

**Level**: Pemula hingga Menengah  
**Waktu**: ~4-6 jam untuk complete setup  
**Bahasa**: Indonesia

---

## 📑 Daftar Isi

1. [Prerequisites (Persyaratan)](#prerequisites-persyaratan)
2. [Konsep Dasar](#konsep-dasar)
3. [Step 1: Setup Development Environment](#step-1-setup-development-environment)
4. [Step 2: Buat Website Frontend (HTML/CSS/JS)](#step-2-buat-website-frontend-htmlcssjs)
5. [Step 3: Setup Backend dengan Cloudflare Workers](#step-3-setup-backend-dengan-cloudflare-workers)
6. [Step 4: Hubungkan Database (D1)](#step-4-hubungkan-database-d1)
7. [Step 5: Integrasi Frontend-Backend](#step-5-integrasi-frontend-backend)
8. [Step 6: Testing & Debugging](#step-6-testing--debugging)
9. [Step 7: Deploy ke Production](#step-7-deploy-ke-production)
10. [Tips & Tricks](#tips--tricks)

---

## 🎯 Prerequisites (Persyaratan)

### Install Software Berikut:

#### **1. Node.js & NPM**
- **Apa itu?** Runtime JavaScript untuk server & tools
- **Cara install**:
  - Kunjungi: https://nodejs.org/
  - Download LTS version (Recommended)
  - Klik next-next-finish
  - Verify install:
    ```bash
    node --version
    npm --version
    ```

#### **2. Git**
- **Apa itu?** Version control untuk tracking perubahan kode
- **Cara install**:
  - Kunjungi: https://git-scm.com/
  - Download Windows version
  - Install dengan default settings
  - Verify:
    ```bash
    git --version
    ```

#### **3. Code Editor (VS Code)**
- **Apa itu?** Program untuk edit/write kode
- **Cara install**:
  - Kunjungi: https://code.visualstudio.com/
  - Download & install
  - Optional extensions:
    - Prettier (format kode)
    - Live Server (preview HTML)
    - Remote - Containers (bonus)

#### **4. Text Editor Simple**
- Bisa pakai Notepad++, Sublime Text, atau VS Code sudah cukup

#### **5. Browser Modern**
- Chrome, Firefox, atau Edge (untuk testing)

### Skill yang Harus Dimiliki:

- [ ] Mengerti basic HTML (tags, attributes)
- [ ] Mengerti basic CSS (styling)
- [ ] Mengerti basic JavaScript (variables, functions, async/await)
- [ ] Mengerti HTTP requests (GET, POST)
- [ ] Mengerti JSON format
- [ ] Mengerti konsep RESTful API

**Jika belum**: Recommend belajar di:
- MDN Web Docs: https://developer.mozilla.org/
- Codecademy: https://www.codecademy.com/
- Udemy: Cari "JavaScript Fundamentals"

---

## 💡 Konsep Dasar

### Arsitektur Client-Server

```
┌─────────────────┐
│   BROWSER       │  (Client Side)
│  - HTML/CSS/JS  │  → User Interface
│  - XMLHttpRequest│  → Interactive
└────────┬────────┘
         │ HTTP Requests/Responses
         │ (JSON data)
         ↓
┌─────────────────────────────┐
│   BACKEND SERVER            │  (Server Side)
│  - Cloudflare Workers       │  → Business Logic
│  - API Endpoints            │  → Data Processing
│  - Authentication           │  → Database Access
└────────┬────────────────────┘
         │
         ↓
┌─────────────────┐
│   DATABASE      │  (Data Storage)
│  - D1 (SQLite)  │  → Permanent Data
│  - Tables       │
└─────────────────┘
```

### Flow Data Sederhana

```
1. User di browser inputkan username/password
   ↓
2. JavaScript kirim POST request ke server
   ↓
3. Server validasi di database
   ↓
4. Server kirim response (success/fail)
   ↓
5. JavaScript tampilkan hasil ke user
   ↓
6. User redirect ke halaman ujian
```

### Komponen Penting:

| Komponen | Fungsi | Contoh |
|----------|--------|--------|
| **Frontend** | Tampilan & interaksi user | HTML, CSS, JavaScript |
| **Backend** | Logic bisnis & data processing | Cloudflare Workers |
| **Database** | Menyimpan data permanent | Cloudflare D1 |
| **API** | Saluran komunikasi frontend-backend | REST API endpoints |
| **Hosting** | Tempat aplikasi berjalan | Cloudflare |

---

## 🚀 Step 1: Setup Development Environment

### 1.1 Buat Folder Project

```bash
# Buka Command Prompt / PowerShell
# Navigasi ke folder yang diinginkan
cd C:\Users\YourName\Documents

# Buat folder baru
mkdir exam-system
cd exam-system

# Inisialisasi git
git init

# Buat struktur folder
mkdir frontend backend
mkdir frontend/css frontend/js
mkdir backend/src
```

### 1.2 Initialize Node Project

```bash
# Di folder backend
cd backend
npm init -y

# Output akan membuat file package.json
```

### 1.3 Install Dependencies

```bash
# Install Wrangler CLI (untuk Cloudflare Workers)
npm install -g wrangler

# Verify
wrangler --version

# Install project dependencies
npm install hono axios dotenv
```

### 1.4 Setup Git

```bash
# Di root folder exam-system
git config user.name "Your Name"
git config user.email "your@email.com"

# Buat .gitignore (file yang tidak perlu di-upload)
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore

# First commit
git add .
git commit -m "Initial project setup"
```

---

## 📝 Step 2: Buat Website Frontend (HTML/CSS/JS)

### 2.1 Struktur HTML Dasar

**File: `frontend/index.html`**

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Ujian Online</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Sistem Ujian Online</h1>
            <p>ACEFEST 2025</p>
        </div>
        
        <div class="content">
            <button onclick="goToLogin()">Login Ujian</button>
            <button onclick="goToResults()">Lihat Hasil</button>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
```

**Penjelasan**:
- `<!DOCTYPE html>` = Deklarasi HTML5
- `<meta charset>` = Character encoding (untuk bahasa Indonesia)
- `<meta viewport>` = Responsive design untuk mobile
- `<link>` = Import CSS file
- `<script>` = Import JavaScript file

### 2.2 Styling CSS

**File: `frontend/css/style.css`**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    border-radius: 15px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
}

.header h1 {
    color: #333;
    margin-bottom: 10px;
    font-size: 2rem;
}

.header p {
    color: #666;
    font-size: 1rem;
    margin-bottom: 30px;
}

button {
    display: block;
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

button:active {
    transform: translateY(0);
}

@media (max-width: 600px) {
    .container {
        padding: 20px;
    }
    
    .header h1 {
        font-size: 1.5rem;
    }
}
```

**Penjelasan CSS**:
- `*` = Select semua element
- `background: linear-gradient()` = Gradient background
- `box-shadow` = Efek bayangan
- `@media` = Responsive design untuk mobile
- `:hover` = Style saat mouse hover
- `transition` = Animation smooth

### 2.3 JavaScript Dasar

**File: `frontend/js/main.js`**

```javascript
// === CONFIGURATION ===
const API_BASE = 'http://localhost:8787'; // Local dev
// const API_BASE = 'https://exam-system.workers.dev'; // Production

// === HELPER FUNCTIONS ===

function goToLogin() {
    console.log('Navigasi ke halaman login');
    // Bisa pakai:
    // window.location.href = 'login.html';
    alert('Login page coming soon!');
}

function goToResults() {
    console.log('Navigasi ke halaman hasil');
    alert('Results page coming soon!');
}

// === API CALLS ===

async function makeAPIRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        return jsonData;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    console.log('API Base:', API_BASE);
});
```

**Penjelasan**:
- `async/await` = Menunggu response dari server
- `fetch()` = Mengirim HTTP request
- `try/catch` = Error handling
- `JSON.stringify()` = Convert object ke JSON string
- `DOMContentLoaded` = Event when page fully loaded

### 2.4 Login Page

**File: `frontend/login.html`**

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Ujian Online</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Login Ujian</h1>
        </div>

        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    placeholder="Masukkan username" 
                    required
                >
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Masukkan password" 
                    required
                >
            </div>

            <div id="errorMessage" class="error" style="display: none;"></div>
            <div id="loadingSpinner" class="spinner" style="display: none;"></div>

            <button type="submit" id="loginBtn">Login</button>
        </form>

        <p style="margin-top: 20px; color: #666;">
            <small>Demo: username: test | password: test123</small>
        </p>
    </div>

    <script src="js/auth.js"></script>
</body>
</html>
```

### 2.5 Auth JavaScript

**File: `frontend/js/auth.js`**

```javascript
const API_BASE = 'http://localhost:8787';
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const loginBtn = document.getElementById('loginBtn');

// === LOGIN FUNCTION ===

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Show loading state
    setLoading(true);
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Success! Save user data ke localStorage
            localStorage.setItem('user_data', JSON.stringify(data.user));
            localStorage.setItem('auth_token', data.token);
            
            console.log('✅ Login success!', data.user);
            
            // Redirect ke exam page
            setTimeout(() => {
                window.location.href = 'exam.html';
            }, 500);
        } else {
            // Show error
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showError('Network error. Check your connection.');
    } finally {
        setLoading(false);
    }
});

// === HELPER FUNCTIONS ===

function setLoading(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'MEMPROSES...';
        loadingSpinner.style.display = 'block';
    } else {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
        loadingSpinner.style.display = 'none';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (localStorage.getItem('user_data')) {
        // Redirect to exam
        window.location.href = 'exam.html';
    }
});
```

**Penjelasan**:
- `e.preventDefault()` = Prevent form default submit behavior
- `localStorage` = Browser's local storage untuk session data
- `JSON.stringify()` = Convert object ke JSON string
- Error handling dengan try/catch

---

## 🔌 Step 3: Setup Backend dengan Cloudflare Workers

### 3.1 Apa itu Cloudflare Workers?

**Analogi Sederhana**:
```
Traditional Server:
  - Beli server fisik/VPS
  - Install OS & software
  - Urus security, update, backup
  - Bayar per bulan

Cloudflare Workers:
  - Kode JavaScript berjalan di edge servers Cloudflare
  - Auto scaling, auto security
  - Bayar per request
  - Deploy dengan 1 command
```

### 3.2 Setup Wrangler Project

```bash
# Generate project
wrangler init exam-backend

# Choose:
# - What type of application? → "website"
# - Typescript? → "no"

# Hasilnya struktur folder:
# exam-backend/
#   ├── src/
#   │   └── index.js
#   ├── package.json
#   └── wrangler.toml

cd exam-backend
```

### 3.3 Edit wrangler.toml

**File: `wrangler.toml`**

```toml
name = "exam-system-backend"
main = "src/index.js"
compatibility_date = "2024-07-25"
compatibility_flags = ["nodejs_compat"]

# Cloudflare account info (auto-filled saat login)
account_id = "your-account-id"
workers_dev = true

# Route binding (manual)
routes = [
  { pattern = "api.exam.com/*", zone_id = "your-zone-id" }
]
```

### 3.4 Buat Backend Simple

**File: `src/index.js`**

```javascript
// =============================================
// EXAM SYSTEM API - CLOUDFLARE WORKERS
// =============================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // =============================================
    // ROUTE 1: Test endpoint
    // =============================================
    if (path === '/api/test' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'API is working!',
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // =============================================
    // ROUTE 2: Login endpoint
    // =============================================
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const { username, password } = await request.json();

        console.log('Login attempt:', username);

        // DEMO: Simple hardcoded user (replace dengan database later!)
        const demoUsers = [
          { 
            id: 1, 
            username: 'test', 
            password: 'test123',
            nama: 'Test User',
            sekolah: 'SMA Test',
            lomba: 'olimpiade_ipa'
          },
          {
            id: 2,
            username: 'budi',
            password: 'budi123',
            nama: 'Budi Santoso',
            sekolah: 'SMA Negeri 1',
            lomba: 'olimpiade_math'
          }
        ];

        // Find user
        const user = demoUsers.find(
          u => u.username === username && u.password === password
        );

        if (user) {
          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: user.id,
                username: user.username,
                nama: user.nama,
                sekolah: user.sekolah,
                lomba: user.lomba
              },
              token: 'dummy-token-' + user.id
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Username atau password salah'
            }),
            { 
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

      } catch (error) {
        console.error('Login error:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Error: ' + error.message
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // =============================================
    // ROUTE 3: Get questions
    // =============================================
    if (path.startsWith('/api/questions') && request.method === 'GET') {
      const lomba = url.searchParams.get('lomba');

      // DEMO: Hardcoded questions
      const questions = [
        {
          id: 1,
          pertanyaan: 'Berapa hasil dari 2 + 2?',
          opsi_a: '3',
          opsi_b: '4',
          opsi_c: '5',
          opsi_d: '6',
          jawaban_benar: 'b'
        },
        {
          id: 2,
          pertanyaan: 'Siapa presiden pertama Indonesia?',
          opsi_a: 'Soekarno',
          opsi_b: 'Soeharto',
          opsi_c: 'Gus Dur',
          opsi_d: 'Megawati',
          jawaban_benar: 'a'
        }
      ];

      return new Response(
        JSON.stringify({
          success: true,
          lomba: lomba,
          questions: questions
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // =============================================
    // ROUTE 4: Submit exam
    // =============================================
    if (path === '/api/exams/submit' && request.method === 'POST') {
      try {
        const { 
          user_id, 
          username, 
          score, 
          answers 
        } = await request.json();

        console.log(`Score submitted: ${username} = ${score}`);

        // TODO: Save to database

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Nilai berhasil disimpan!',
            score: score
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('Submit error:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Error submitting exam'
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // =============================================
    // 404 - Not Found
    // =============================================
    return new Response(
      JSON.stringify({
        error: 'Endpoint not found'
      }),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
```

**Penjelasan Struktur**:

```javascript
export default {           // Default export untuk Workers
  async fetch(request) {   // Main handler function
    // request = HTTP request object
    // request.url = URL yang diakses
    // request.method = GET, POST, PUT, DELETE, dll
    // request.json() = Parse body sebagai JSON
  }
}
```

### 3.5 Test Backend Locally

```bash
# Di folder backend
npm install

# Start local server
wrangler dev

# Output:
# ➜ Local:   http://localhost:8787/
# ➜ Ready!

# Test di endpoint:
# http://localhost:8787/api/test

# Harusnya return JSON success
```

**Testing dengan curl** (di PowerShell/Terminal baru):

```bash
# Test GET endpoint
curl http://localhost:8787/api/test

# Test POST (login)
curl -X POST http://localhost:8787/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"test","password":"test123"}'
```

---

## 🗄️ Step 4: Hubungkan Database (D1)

### 4.1 Apa itu D1?

```
D1 adalah serverless SQL database dari Cloudflare
= SQLite yang berjalan di edge
= Gratis untuk development
= Tidak perlu setup VPS/server database
```

### 4.2 Login & Create Database

```bash
# Login ke Cloudflare
wrangler login

# Akan membuka browser untuk authorize

# Create database
wrangler d1 create exam-database

# Output:
# ✅ Successfully created D1 database 'exam-database'
# ⚙️  Binding is already set in wrangler.toml
# 📝 Id: 68ca43f7-ab69-425b-a932-ead777e2fa2b
```

### 4.3 Update wrangler.toml

```toml
# Tambahkan binding
[[d1_databases]]
binding = "DB"
database_name = "exam-database"
database_id = "68ca43f7-ab69-425b-a932-ead777e2fa2b"
```

### 4.4 Buat Schema (Database Structure)

**File: `schema.sql`**

```sql
-- =============================================
-- TABLE: peserta (Students/Participants)
-- =============================================
CREATE TABLE IF NOT EXISTS peserta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    sekolah VARCHAR(100),
    lomba VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- =============================================
-- TABLE: results (Exam Results)
-- =============================================
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username VARCHAR(50),
    nama VARCHAR(100),
    sekolah VARCHAR(100),
    lomba VARCHAR(50),
    score INTEGER,
    answers TEXT,  -- JSON stringified
    time_spent INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES peserta(id)
);

-- =============================================
-- INDEX (Speed up queries)
-- =============================================
CREATE INDEX idx_peserta_username ON peserta(username);
CREATE INDEX idx_peserta_lomba ON peserta(lomba);
CREATE INDEX idx_results_user_id ON results(user_id);
CREATE INDEX idx_results_lomba ON results(lomba);

-- =============================================
-- INITIAL DATA (Demo)
-- =============================================
INSERT INTO peserta (username, password, nama, sekolah, lomba)
VALUES 
    ('test', 'test123', 'Test User', 'SMA Test', 'olimpiade_ipa'),
    ('budi', 'budi123', 'Budi Santoso', 'SMA Negeri 1', 'olimpiade_math');
```

### 4.5 Execute Schema

```bash
# Upload schema ke database
wrangler d1 execute exam-database --file=./schema.sql

# Output:
# ✅ Successfully executed 'schema.sql' on database
```

### 4.6 Verify Database

```bash
# Cek tables
wrangler d1 execute exam-database --command="SELECT name FROM sqlite_master WHERE type='table'"

# Cek data
wrangler d1 execute exam-database --command="SELECT * FROM peserta"
```

### 4.7 Update Backend untuk Gunakan Database

**Update: `src/index.js` - Login endpoint**

```javascript
if (path === '/api/auth/login' && request.method === 'POST') {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', username);

    // Query database (GANTI hardcoded users)
    const user = await env.DB.prepare(
      "SELECT * FROM peserta WHERE username = ? AND password = ?"
    ).bind(username, password).first();

    if (user) {
      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            nama: user.nama,
            sekolah: user.sekolah,
            lomba: user.lomba
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username atau password salah'
        }),
        { status: 401, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
```

**Penjelasan**:
- `env.DB` = Database binding dari wrangler.toml
- `.prepare()` = Query preparation
- `.bind()` = Assign parameters
- `.first()` = Get first result only

---

## 🔗 Step 5: Integrasi Frontend-Backend

### 5.1 Update API_BASE di Frontend

**Di semua file JavaScript frontend**:

```javascript
// Local development
const API_BASE = 'http://localhost:8787';

// Production (setelah deploy)
// const API_BASE = 'https://exam-system.timacefest2025.workers.dev';
```

### 5.2 Buat Exam Page

**File: `frontend/exam.html`**

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ujian - Sistem Ujian</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .exam-container {
            max-width: 800px;
            margin: 20px auto;
        }

        .timer {
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 1.2rem;
            margin-bottom: 20px;
            text-align: center;
        }

        .question-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .options {
            margin: 15px 0;
        }

        .option {
            padding: 10px;
            margin: 8px 0;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .option:hover {
            border-color: #667eea;
            background: #f5f5f5;
        }

        .option.selected {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
    </style>
</head>
<body>
    <div class="exam-container">
        <div class="timer" id="timer">
            Waktu: <span id="timeLeft">02:00:00</span>
        </div>

        <div id="examContent">
            <!-- Questions akan di-render oleh JavaScript -->
        </div>

        <button onclick="submitExam()" class="btn">
            ✅ Selesaikan & Submit
        </button>
    </div>

    <script src="js/exam.js"></script>
</body>
</html>
```

### 5.3 Exam Logic JavaScript

**File: `frontend/js/exam.js`**

```javascript
const API_BASE = 'http://localhost:8787';

class ExamSystem {
    constructor() {
        this.questions = [];
        this.userAnswers = {};
        this.startTime = Date.now();
        this.duration = 2 * 60 * 60 * 1000; // 2 jam
        this.userData = JSON.parse(localStorage.getItem('user_data'));
        this.isSubmitting = false;
    }

    async initialize() {
        console.log('Initializing exam...');

        // Check auth
        if (!this.userData) {
            alert('Silakan login terlebih dahulu');
            window.location.href = 'login.html';
            return;
        }

        // Load questions
        await this.loadQuestions();

        // Start timer
        this.startTimer();

        // Setup submit handler
        this.setupEventListeners();

        console.log('✅ Exam initialized');
    }

    async loadQuestions() {
        try {
            const response = await fetch(
                `${API_BASE}/api/questions?lomba=${this.userData.lomba}`
            );
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            this.questions = data.questions;

            // Initialize answer map
            this.questions.forEach((q, i) => {
                this.userAnswers[i] = null;
            });

            // Render questions
            this.renderQuestions();

        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Gagal memuat soal: ' + error.message);
        }
    }

    renderQuestions() {
        const container = document.getElementById('examContent');
        let html = '';

        this.questions.forEach((q, index) => {
            html += `
                <div class="question-card">
                    <h3>Soal ${index + 1}</h3>
                    <p>${q.pertanyaan}</p>
                    
                    <div class="options">
                        <label class="option">
                            <input 
                                type="radio" 
                                name="q${index}" 
                                value="a"
                                onchange="window.examSystem.selectAnswer(${index}, 'a')"
                            >
                            A) ${q.opsi_a}
                        </label>
                        <label class="option">
                            <input 
                                type="radio" 
                                name="q${index}" 
                                value="b"
                                onchange="window.examSystem.selectAnswer(${index}, 'b')"
                            >
                            B) ${q.opsi_b}
                        </label>
                        <label class="option">
                            <input 
                                type="radio" 
                                name="q${index}" 
                                value="c"
                                onchange="window.examSystem.selectAnswer(${index}, 'c')"
                            >
                            C) ${q.opsi_c}
                        </label>
                        <label class="option">
                            <input 
                                type="radio" 
                                name="q${index}" 
                                value="d"
                                onchange="window.examSystem.selectAnswer(${index}, 'd')"
                            >
                            D) ${q.opsi_d}
                        </label>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    selectAnswer(questionIndex, answer) {
        console.log(`Q${questionIndex}: Selected ${answer}`);
        this.userAnswers[questionIndex] = answer;
        this.autoSave();
    }

    startTimer() {
        const timerElement = document.getElementById('timeLeft');

        setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const remaining = this.duration - elapsed;

            if (remaining <= 0) {
                this.submitExam();
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            timerElement.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // Warning saat 10 menit
            if (remaining < 10 * 60 * 1000) {
                document.getElementById('timer').style.animation = 'blink 0.5s infinite';
            }
        }, 1000);
    }

    autoSave() {
        localStorage.setItem('exam_answers', JSON.stringify(this.userAnswers));
        console.log('Auto-saved answers');
    }

    setupEventListeners() {
        // Prevent page refresh/back
        window.addEventListener('beforeunload', (e) => {
            if (!this.isSubmitting) {
                e.preventDefault();
                e.returnValue = 'Data exam Anda akan hilang!';
            }
        });
    }

    async submitExam() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;

        try {
            // Calculate score
            let correct = 0;
            this.questions.forEach((q, i) => {
                if (this.userAnswers[i] === q.jawaban_benar) {
                    correct++;
                }
            });

            const score = Math.round((correct / this.questions.length) * 100);

            console.log(`Score: ${score} (${correct}/${this.questions.length})`);

            // Submit to server
            const response = await fetch(`${API_BASE}/api/exams/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    username: this.userData.username,
                    nama: this.userData.nama,
                    sekolah: this.userData.sekolah,
                    lomba: this.userData.lomba,
                    score: score,
                    answers: this.userAnswers
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ Ujian selesai! Score: ${score}`);
                localStorage.removeItem('exam_answers');
                window.location.href = 'results.html';
            } else {
                alert('❌ Gagal submit: ' + data.message);
            }

        } catch (error) {
            console.error('Submit error:', error);
            alert('Error mensubmit ujian: ' + error.message);
        } finally {
            this.isSubmitting = false;
        }
    }
}

// ===========================
// Initialization
// ===========================

window.examSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    window.examSystem = new ExamSystem();
    window.examSystem.initialize();
});
```

---

## ✅ Step 6: Testing & Debugging

### 6.1 Testing Checklist

```markdown
[ ] Frontend loads correctly
  [ ] index.html menampilkan buttons
  [ ] Styling terlihat bagus
  [ ] No console errors

[ ] Backend running
  [ ] wrangler dev berjalan di port 8787
  [ ] /api/test endpoint accessible
  [ ] Returns JSON response

[ ] Login functionality
  [ ] Form submit works
  [ ] API call made to /api/auth/login
  [ ] Demo user (test/test123) login success
  [ ] localStorage saved correctly
  [ ] Redirect to exam.html works

[ ] Database connection
  [ ] D1 database created
  [ ] Schema executed successfully
  [ ] Data inserted correctly
  [ ] Query returns results

[ ] Exam functionality
  [ ] Questions load from API
  [ ] Can select answers
  [ ] Timer counting down
  [ ] Submit saves score

[ ] Error handling
  [ ] Wrong password shows error
  [ ] Network error handled
  [ ] Timer auto-submit works
```

### 6.2 Debug Console Log

**Format yang Berguna**:

```javascript
// ❌ Jangan
console.log(data);

// ✅ Lebih baik
console.log('🔍 User data:', data);
console.log('✅ Login success:', { username, score });
console.log('❌ Error occurred:', error.message);
```

### 6.3 Browser DevTools

```
F12 / Right-click → Inspect
```

**Network Tab**:
- Cek HTTP requests
- Lihat response headers

**Console Tab**:
- Lihat JavaScript errors
- Run test commands

**Storage Tab**:
- Debug localStorage
- Clear cache jika perlu

### 6.4 Common Errors & Fix

| Error | Penyebab | Solusi |
|-------|----------|--------|
| CORS error | API endpoint tidak allow request | Add CORS headers di backend |
| 404 Not Found | Endpoint tidak ada | Check path spelling di frontend |
| Blank page | JavaScript error | Check console for errors |
| Data tidak tersimpan | localStorage cleared | Check storage quota |

---

## 🌍 Step 7: Deploy ke Production

### 7.1 Deploy Backend ke Cloudflare

```bash
# Pastikan sudah login
wrangler login

# Deploy
wrangler deploy

# Output:
# ✨ Compiled successfully
# 
# ✨ Published Exam Backend
#   https://exam-backend-xyz.timacefest2025.workers.dev

# Copy URL ini!
```

### 7.2 Update Frontend API_BASE

**Di semua file JavaScript**:

```javascript
// Before (local)
const API_BASE = 'http://localhost:8787';

// After (production)
const API_BASE = 'https://exam-backend-xyz.timacefest2025.workers.dev';
```

### 7.3 Deploy Frontend

**Option A: Cloudflare Pages** (Recommended)

```bash
# Install Wrangler di root
npm install -D wrangler

# Create pages project
# Di Cloudflare Dashboard:
# 1. Go to Pages
# 2. Create → Connect to Git
# 3. Select repo
# 4. Build command: none (static files)
# 5. Build output: /frontend

# Auto-deploy push ke main branch!
```

**Option B: Manual Upload**

```bash
# Create zip dari frontend folder
# Upload ke hosting (Netlify, Vercel, GitHub Pages, dll)
```

### 7.4 Custom Domain (Optional)

```
1. Beli domain di registrar (Namecheap, GoDaddy, dll)
2. Di Cloudflare Dashboard:
   - Add site
   - Change nameservers ke Cloudflare
   - Create A record pointing ke Cloudflare Pages IP
3. Set custom domain di Pages settings
```

### 7.5 Verify Production

```bash
# Test endpoint
curl https://exam-backend.workers.dev/api/test

# Seharusnya return:
# {"status":"ok","message":"API is working!"}

# Test login
curl -X POST https://exam-backend.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

---

## 💡 Tips & Tricks

### 1. Rapid Development Setup

```bash
# Terminal 1: Backend
cd backend
wrangler dev

# Terminal 2: Frontend (serve static files)
cd frontend
python -m http.server 8000
# Atau: npx http-server

# Browser:
# Frontend: http://localhost:8000
# API: http://localhost:8787
```

### 2. Environment Variables

```bash
# Create .env file
API_KEY=your_secret_here
DATABASE_URL=your_db_url
```

**Access di JavaScript**:

```javascript
// Cloudflare Workers
if (env.ENVIRONMENT === 'production') {
    // Production code
}

// Frontend (setelah build)
const API_KEY = process.env.REACT_APP_API_KEY;
```

### 3. Useful Commands

```bash
# See all databases
wrangler d1 list

# Backup database
wrangler d1 execute exam-database --file=dump.sql

# Clear local cache
rm .wrangler

# View live logs
wrangler tail

# See deployments
wrangler deployments list

# Rollback
wrangler rollback
```

### 4. Performance Tips

**Frontend**:
```javascript
// Lazy load images
<img loading="lazy" src="image.jpg">

// Minimize API calls
// Auto-save setiap 30 detik, bukan setiap keystroke

// Cache static assets
// Use Cache API di service worker
```

**Backend**:
```javascript
// Optimize database queries
// Gunakan INDEX untuk filter column
// SELECT * FROM peserta WHERE username = ? (indexed)
// vs
// SELECT * FROM peserta (full scan)

// Batch operations
// Insert 100 rows dalam 1 query
// vs
// 100 individual insert queries
```

### 5. Security Reminders

```javascript
// ❌ NEVER hardcode sensitive data
const password = 'hardcoded_password'; // BAD!

// ✅ Use environment variables
const password = env.DATABASE_PASSWORD;

// ❌ NEVER send passwords in plain text
POST /api/auth/login
Body: { "password": "test123" }

// ✅ Use HTTPS + Hash passwords
POST /api/auth/login (encrypted via HTTPS)
Database: bcrypt hashed password

// ❌ Trust user input
const sql = `SELECT * FROM peserta WHERE username = '${username}'`; // SQL Injection!

// ✅ Use parameterized queries
env.DB.prepare("SELECT * FROM peserta WHERE username = ?").bind(username)
```

### 6. Scaling Roadmap

```
Phase 1 (Current)
├─ Single-page forms
├─ Manual database entries
└─ Basic authentication

Phase 2 (Next)
├─ Admin dashboard untuk input peserta
├─ Batch upload peserta via CSV
├─ Email notifications
└─ Password hashing dengan bcrypt

Phase 3 (Advanced)
├─ WebSocket untuk real-time updates
├─ Video streaming dengan Cloudflare Stream
├─ Advanced analytics dashboard
├─ Automated grading untuk essay
└─ Mobile app dengan React Native

Phase 4 (Enterprise)
├─ Multiple sites/branches
├─ Proctoring system
├─ Payment integration
├─ AI-powered plagiarism detection
└─ Accessibility compliance (WCAG)
```

---

## 📚 Learning Resources

### Frontend Development
- **MDN Web Docs**: https://developer.mozilla.org/
- **CSS Tricks**: https://css-tricks.com/
- **JavaScript.info**: https://javascript.info/

### Backend/Cloudflare
- **Cloudflare Docs**: https://developers.cloudflare.com/
- **Hono Framework**: https://hono.dev/ (untuk API kompleks)
- **Workers Examples**: https://github.com/cloudflare/workers

### Database
- **SQLite Tutorial**: https://www.sqlite.org/
- **D1 Documentation**: https://developers.cloudflare.com/d1/

### Best Practices
- **RESTful API**: https://restfulapi.net/
- **Web Security**: https://owasp.org/www-project-api-security/
- **Clean Code**: Robert C. Martin "Clean Code"

---

## 🎯 Project Checklist

Gunakan checklist ini untuk track progress:

```markdown
## Setup
- [ ] Node.js & npm installed
- [ ] Git initialized
- [ ] VS Code ready

## Frontend Development
- [ ] index.html created
- [ ] style.css styling done
- [ ] main.js working
- [ ] login.html created
- [ ] auth.js logic done
- [ ] exam.html created
- [ ] exam.js logic done

## Backend Development
- [ ] Wrangler initialized
- [ ] Basic endpoints working
- [ ] CORS configured
- [ ] Error handling done

## Database
- [ ] D1 database created
- [ ] schema.sql created
- [ ] Tables created
- [ ] Demo data inserted
- [ ] Backend queries database

## Integration
- [ ] Frontend → Backend API
- [ ] Login flow complete
- [ ] Exam flow complete
- [ ] Results display complete

## Testing
- [ ] All endpoints tested
- [ ] All flows tested
- [ ] Error cases handled
- [ ] Security reviewed

## Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Custom domain (optional)
- [ ] SSL/TLS enabled
- [ ] Production tested
```

---

## 🎉 Kesimpulan

Anda sekarang memiliki framework dasar untuk membuat sistem exam kompleks:

### Apa yang Anda Pelajari:
✅ Vue dasar frontend (HTML/CSS/JavaScript)  
✅ Cara buat API dengan Cloudflare Workers  
✅ Database dengan D1  
✅ Integrasi frontend-backend  
✅ Testing & debugging  
✅ Deployment ke production  

### Next Steps:
1. Customize sesuai kebutuhan
2. Tambah fitur (video upload, scoring otomatis, dll)
3. Improve security (password hashing, rate limiting, dll)
4. Scale untuk lebih banyak pengguna
5. Monitoring & analytics

### Resources untuk Lanjut:
- Belajar framework (React, Vue, Svelte)
- Database lebih advanced (PostgreSQL, MongoDB)
- WebSocket untuk real-time features
- Machine learning untuk grading otomatis
- DevOps & containerization (Docker)

---

## 📞 Support & Help

### Jika Stuck:
1. **Error Message?** → Copas ke Google
2. **Docs unclear?** → Check MDN atau oficial docs
3. **API not working?** → Check network tab di DevTools
4. **Database error?** → Test query di D1 CLI langsung

### Community:
- StackOverflow
- GitHub Discussions
- Dev.to
- Discord programming servers

---

**Happy Coding! 🚀 Semoga tutorial ini membantu dalam memahami cara membuat sistem exam online yang scalable dan robust!**

Jika ada yang kurang jelas atau butuh clarification, jangan ragu untuk bertanya. Good luck dengan development Anda! 💪

---

**Maintained by**: TIM IT ACEFEST  
**Last Updated**: March 2025  
**Version**: 1.0.0
