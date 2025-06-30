import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) cb(null, true);
    else cb(new Error("Only images allowed"));
};

export default multer({ storage, fileFilter });