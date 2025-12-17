const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Kompres gambar dan convert ke WebP
 * @param {Buffer} buffer - File buffer dari Multer
 * @param {String} filename - Nama file asli
 * @returns {String} - Nama file baru (webp)
 */
const compressImage = async (buffer, filename) => {
    // Pastikan direktori ada
    const uploadDir = path.join(__dirname, '../assets/uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const nameWithoutExt = path.parse(filename).name;
    const newFilename = `${Date.now()}-${nameWithoutExt}.webp`;
    const outputPath = path.join(uploadDir, newFilename);

    await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200px
        .webp({ quality: 80 }) // Convert ke WebP kualitas 80%
        .toFile(outputPath);

    return newFilename;
};

module.exports = compressImage;
