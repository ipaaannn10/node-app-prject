// routes/admin/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../../utils/db');

// [GET] Tampilkan Halaman Login
router.get('/login', (req, res) => {
    // Jika sudah login, redirect ke dashboard
    if (req.session.isLoggedIn) {
        return res.redirect('/admin'); 
    }
    res.render('admin/login', { error: req.session.loginError });
    req.session.loginError = null; 
});

// [POST] Proses Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password_hashed)) {
            // Login Sukses
            req.session.isLoggedIn = true;
            req.session.user = { id: user.id, username: user.username };
            return res.redirect('/admin'); 
        } else {
            // Login Gagal
            req.session.loginError = 'Username atau Password salah!';
            return res.redirect('/auth/login');
        }
    } catch (error) {
        // Ini adalah error yang lu alami (DB Connection)
        console.error('Error saat login/koneksi DB:', error);
        req.session.loginError = 'Terjadi kesalahan server saat menghubungkan database.';
        res.redirect('/auth/login');
    }
});

// [GET] Proses Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;        }
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
