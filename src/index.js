// src/index.js - Simple version without Hono
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Routes
    if (path === '/' && request.method === 'GET') {
      return new Response('🎯 Exam System API - TIMAC FEST 2025', {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    if (path === '/api/test' && request.method === 'GET') {
      return Response.json({
        status: 'ok',
        message: 'API is working perfectly!',
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
    }

    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const { username, password } = await request.json();
        
        console.log('Login attempt:', username);
        
        // Cek user di database
        const user = await env.DB.prepare(
          "SELECT * FROM peserta WHERE username = ? AND password = ?"
        ).bind(username, password).first();
        
        if (user) {
          return Response.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              nama: user.nama,
              sekolah: user.sekolah,
              lomba: user.lomba
            },
            redirectUrl: `/exams/exam_${user.lomba}.html`
          }, { headers: corsHeaders });
        } else {
          return Response.json({
            success: false,
            message: 'Username atau password salah'
          }, { 
            status: 401,
            headers: corsHeaders 
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        return Response.json({
          success: false,
          message: 'Login gagal: ' + error.message
        }, { 
          status: 500,
          headers: corsHeaders 
        });
      }
    }

    if (path === '/api/exams/submit' && request.method === 'POST') {
      try {
        const { user_id, username, nama, sekolah, lomba, score, answers, time_spent } = await request.json();
        
        console.log('Score submission:', { username, score, lomba });
        
        // Simpan ke database
        const result = await env.DB.prepare(
          `INSERT INTO results (user_id, username, nama, sekolah, lomba, score, answers, time_spent) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(user_id, username, nama, sekolah, lomba, score, JSON.stringify(answers), time_spent).run();
        
        return Response.json({
          success: true,
          message: 'Nilai berhasil disimpan!',
          score: score
        }, { headers: corsHeaders });
        
      } catch (error) {
        console.error('Submit error:', error);
        return Response.json({ 
          success: false,
          error: 'Gagal menyimpan nilai',
          details: error.message 
        }, { 
          status: 500,
          headers: corsHeaders 
        });
      }
    }

    if (path.startsWith('/api/results/') && request.method === 'GET') {
      try {
        const lomba = path.split('/').pop();
        
        const results = await env.DB.prepare(
          `SELECT username, nama, sekolah, score, time_spent, submitted_at 
           FROM results 
           WHERE lomba = ? 
           ORDER BY score DESC, time_spent ASC 
           LIMIT 100`
        ).bind(lomba).all();
        
        return Response.json({
          success: true,
          lomba: lomba,
          leaderboard: results.results || []
        }, { headers: corsHeaders });
      } catch (error) {
        console.error('Get results error:', error);
        return Response.json({ 
          success: false,
          error: 'Gagal mengambil leaderboard'
        }, { 
          status: 500,
          headers: corsHeaders 
        });
      }
    }

    if (path === '/api/peserta' && request.method === 'GET') {
      try {
        const peserta = await env.DB.prepare(
          "SELECT username, nama, sekolah, lomba FROM peserta ORDER BY lomba, nama"
        ).all();
        
        return Response.json({
          success: true,
          peserta: peserta.results || []
        }, { headers: corsHeaders });
      } catch (error) {
        console.error('Get peserta error:', error);
        return Response.json({ 
          success: false,
          error: 'Gagal mengambil data peserta'
        }, { 
          status: 500,
          headers: corsHeaders 
        });
      }
    }

    // 404 Not Found
    return Response.json({ error: 'Endpoint not found' }, { 
      status: 404,
      headers: corsHeaders 
    });
  }
}