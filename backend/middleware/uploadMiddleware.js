const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables
console.log('--- Cloudinary Config Debug ---');
console.log('Cloud Name:', `"${process.env.CLOUDINARY_CLOUD_NAME}"`); // Quoted to see spaces
console.log('API Key Present:', !!process.env.CLOUDINARY_API_KEY);
console.log('API Secret Present:', !!process.env.CLOUDINARY_API_SECRET);
console.log('-------------------------------');

cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Map the original file extensions to Cloudinary resource types and formats
        const fileExt = file.originalname.split('.').pop().toLowerCase();

        let folder = 'codexael/other';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
            folder = 'codexael/images';
        } else if (fileExt === 'pdf') {
            folder = 'codexael/documents';
        } else if (fileExt === 'zip') {
            folder = 'codexael/archives';
        }

        return {
            folder: folder,
            resource_type: 'auto', // Important for non-image files like PDFs and ZIPs
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
    fileFilter: function (req, file, cb) {
        // Filter by extensions (Cloudinary handles mime-types well with resource_type: auto)
        const filetypes = /jpg|jpeg|png|pdf|zip/;
        const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());

        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPG/PNG), PDFs, and ZIP files are allowed!'));
        }
    },
});

module.exports = upload;

