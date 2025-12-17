// routes/admin/dashboard.js
const express = require('express');
const router = express.Router();

// [GET] Dashboard Utama (/admin)
router.get('/', (req, res) => {
    res.render('admin/dashboard', { 
        title: 'Dashboard Utama',
        user: req.session.user
    });
});

module.exports = router;    try {
        if (req.file) {
            // Proses Kompresi via Utils
            namaFileGambar = await compressImage(req.file.buffer, req.file.originalname);
        }

        await db.execute(
            'INSERT INTO paket (nama_paket, harga, deskripsi, gambar) VALUES (?, ?, ?, ?)',
            [nama_paket, harga, deskripsi, namaFileGambar]
        );

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menyimpan data.");
    }
});

module.exports = router;
