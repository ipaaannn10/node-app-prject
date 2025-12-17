// app.js
require('dotenv').config(); // VVVV Wajib di Baris 1 VVVV

const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// 1. Setup Environment Hostinger
const port = process.env.PORT || 8080;

// 2. Middleware Dasar
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Setup Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia_hostinger_secure',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 jam
}));

// 4. Setup View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 5. Static Files (PENTING: Akses ke assets/uploads)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 6. Middleware Cek Login (Global untuk Admin)
const checkAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// 7. Routes Import
const authRoutes = require('./routes/admin/auth');
const dashboardRoutes = require('./routes/admin/dashboard');

// 8. Routes Mounting
app.use('/auth', authRoutes); // Login/Logout tidak perlu checkAuth
app.use('/admin', checkAuth, dashboardRoutes); // Semua route /admin WAJIB login

// Root redirect
app.get('/', (req, res) => res.redirect('/admin')); 

// 9. Error Handling 404
app.use((req, res) => {
    res.status(404).send('404 - Halaman tidak ditemukan');
});

// 10. Start Server
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
// 8. Error Handling 404
app.use((req, res) => {
    res.status(404).send('404 - Halaman tidak ditemukan');
});

// 9. Start Server
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
