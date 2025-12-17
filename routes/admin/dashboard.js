const express = require('express');
const router = express.Router();
const db = require('../../utils/db');
const multer = require('multer');
const compressImage = require('../../utils/imageCompressor');

// Setup Multer (Simpan di Memory agar bisa diproses Sharp)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware Cek Login
const requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/auth/login');
    next();
};

router.use(requireAuth);

// Dashboard Index (List Paket)
router.get('/', async (req, res) => {
    try {
        const [paket] = await db.execute('SELECT * FROM paket ORDER BY id DESC');
        res.render('admin/dashboard', { 
            user: req.session.username,
            paket: paket 
        });
    } catch (err) {
        res.send("Error Database");
    }
});

// Proses Tambah Paket + Upload Gambar
router.post('/add-paket', upload.single('gambar'), async (req, res) => {
    const { nama_paket, harga, deskripsi } = req.body;
    let namaFileGambar = null;

    try {
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
