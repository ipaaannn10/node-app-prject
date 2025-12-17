const express = require('express');
const router = express.Router();
const db = require('../../utils/db');
const bcrypt = require('bcryptjs');

// Halaman Login
router.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/admin/dashboard');
    res.render('admin/login', { error: null });
});

// Proses Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.render('admin/login', { error: 'User tidak ditemukan' });
        }

        // Cek Password (gunakan bcrypt.compareSync untuk production)
        // Untuk demo cepat dengan hash manual di SQL, pastikan logika ini sesuai
        const isMatch = await bcrypt.compare(password, user.password_hashed);
        
        // JIKA ANDA BELUM PUNYA HASH VALID DI DB, GANTI LINE DI ATAS DENGAN:
        // const isMatch = (password === "password123"); // HANYA UNTUK TESTING

        if (isMatch) {
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.redirect('/admin/dashboard');
        } else {
            return res.render('admin/login', { error: 'Password salah' });
        }
    } catch (err) {
        console.error(err);
        res.render('admin/login', { error: 'Terjadi kesalahan server' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;
