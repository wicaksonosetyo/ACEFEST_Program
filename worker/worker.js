import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'

const app = new Hono()

// CORS middleware
app.use('/*', cors())

// JWT secret
const JWT_SECRET = 'your-jwt-secret-key-change-in-production'

// Auth middleware
const authMiddleware = jwt({ secret: JWT_SECRET })

// Routes
app.get('/', (c) => c.text('Exam System API Ready!'))

// Login endpoint
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password, lomba } = await c.req.json()
    
    console.log('Login attempt:', { username, lomba })
    
    // Cek user di database
    const user = await c.env.DB.prepare(
      "SELECT * FROM peserta WHERE username = ? AND password = ? AND lomba = ?"
    ).bind(username, password, lomba).first()
    
    if (user) {
      // Generate JWT token
      const payload = {
        userId: user.id,
        username: user.username,
        nama: user.nama,
        sekolah: user.sekolah,
        lomba: user.lomba,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 jam
      }
      
      const token = await jwt.sign(payload, JWT_SECRET)
      
      // Tentukan redirect URL
      const redirectUrl = getExamRedirectUrl(user.lomba)
      
      return c.json({
        success: true,
        token: token,
        redirectUrl: redirectUrl,
        user: {
          id: user.id,
          username: user.username,
          nama: user.nama,
          sekolah: user.sekolah,
          lomba: user.lomba
        }
      })
    } else {
      return c.json({
        success: false,
        message: 'Username, password, atau lomba tidak valid'
      }, 401)
    }
  } catch (error) {
    console.error('Login error:', error)
    return c.json({
      success: false,
      message: 'Login gagal: ' + error.message
    }, 500)
  }
})

// Get questions by lomba
app.get('/api/questions/:lomba', async (c) => {
  try {
    const lomba = c.req.param('lomba')
    console.log('Fetching questions for:', lomba)
    
    const validLombas = ['olimpiade_ipa', 'olimpiade_math', 'olimpiade_ips', 'olimpiade_pai', 'lctp']
    
    if (!validLombas.includes(lomba)) {
      return c.json({ error: 'Lomba tidak valid' }, 404)
    }
    
    const questions = await c.env.DB.prepare(
      `SELECT * FROM questions_${lomba} ORDER BY id ASC`
    ).all()
    
    return c.json({
      success: true,
      lomba: lomba,
      questions: questions.results || []
    })
  } catch (error) {
    console.error('Get questions error:', error)
    return c.json({ 
      error: 'Gagal mengambil soal',
      details: error.message 
    }, 500)
  }
})

// Submit exam results
app.post('/api/exams/submit', authMiddleware, async (c) => {
  try {
    const user = c.get('jwtPayload')
    const { answers, time_spent } = await c.req.json()
    
    console.log('Submission from:', user.username, 'Lomba:', user.lomba)
    
    // Calculate score
    let score = 0
    const questionIds = Object.keys(answers)
    
    // Get correct answers
    const correctAnswers = await c.env.DB.prepare(
      `SELECT id, correct_answer FROM questions_${user.lomba} WHERE id IN (${questionIds.map(() => '?').join(',')})`
    ).bind(...questionIds).all()
    
    // Calculate score
    correctAnswers.results.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        score += 1
      }
    })
    
    // Save to specific results table
    const result = await c.env.DB.prepare(
      `INSERT INTO results_${user.lomba} (user_id, username, nama, sekolah, score, answers, time_spent) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      user.userId,
      user.username,
      user.nama,
      user.sekolah,
      score,
      JSON.stringify(answers),
      time_spent
    ).run()
    
    return c.json({
      success: true,
      score: score,
      total_questions: questionIds.length,
      correct_answers: score,
      lomba: user.lomba
    })
    
  } catch (error) {
    console.error('Submit error:', error)
    return c.json({ 
      error: 'Gagal submit ujian',
      details: error.message 
    }, 500)
  }
})

// Get results by lomba
app.get('/api/results/:lomba', async (c) => {
  try {
    const lomba = c.req.param('lomba')
    
    const validLombas = ['olimpiade_ipa', 'olimpiade_math', 'olimpiade_ips', 'olimpiade_pai', 'lctp']
    if (!validLombas.includes(lomba)) {
      return c.json({ error: 'Lomba tidak valid' }, 404)
    }
    
    const results = await c.env.DB.prepare(
      `SELECT username, nama, sekolah, score, time_spent, submitted_at 
       FROM results_${lomba} 
       ORDER BY score DESC, time_spent ASC 
       LIMIT 100`
    ).all()
    
    return c.json({
      success: true,
      lomba: lomba,
      leaderboard: results.results || []
    })
  } catch (error) {
    console.error('Get results error:', error)
    return c.json({ 
      error: 'Gagal mengambil hasil',
      details: error.message 
    }, 500)
  }
})

// Get user's own result
app.get('/api/my-result/:lomba', authMiddleware, async (c) => {
  try {
    const user = c.get('jwtPayload')
    const lomba = c.req.param('lomba')
    
    if (user.lomba !== lomba) {
      return c.json({ error: 'Akses ditolak' }, 403)
    }
    
    const result = await c.env.DB.prepare(
      `SELECT * FROM results_${lomba} 
       WHERE user_id = ? 
       ORDER BY submitted_at DESC 
       LIMIT 1`
    ).bind(user.userId).first()
    
    return c.json({
      success: true,
      result: result || null
    })
  } catch (error) {
    console.error('Get my result error:', error)
    return c.json({ 
      error: 'Gagal mengambil hasil pribadi',
      details: error.message 
    }, 500)
  }
})

// Helper function
function getExamRedirectUrl(lomba) {
  const routes = {
    'olimpiade_ipa': '/exams/exam_olimpiade_ipa.html',
    'olimpiade_math': '/exams/exam_olimpiade_math.html',
    'olimpiade_ips': '/exams/exam_olimpiade_ips.html',
    'olimpiade_pai': '/exams/exam_olimpiade_pai.html',
    'lctp': '/exams/exam_lctp.html'
  }
  return routes[lomba] || '/login.html'
}

export default app