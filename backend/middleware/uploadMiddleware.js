const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// Check file type — images, PDFs, and ZIPs
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf|zip/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Accept common zip mimetypes as well
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/jpg',
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/octet-stream',
        'multipart/x-zip',
    ];
    const mimetype = allowedMimes.includes(file.mimetype) || /pdf|jpeg|jpg|png/.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Only images (JPG/PNG), PDFs, and ZIP files are allowed!');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
