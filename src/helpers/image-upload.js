const multer = require('multer');

// Destination to store the images
const imageStorage = multer.diskStorage({
    destination(req, file, cb) {
        const folder = 'uploads';
        cb(null, `src/${folder}`);
    },
    
    filename(req, file, cb) {
        cb(null, `${req.params.id}.jpeg`);
    },
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg)$/)) {
            return cb(new Error('Arquivo não é JPEG'));
        }
        cb(undefined, true);
    },
});

// const imageUpload = multer({ dest: 'src/uploads/' });

module.exports = { imageUpload };