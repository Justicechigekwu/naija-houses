import multer from 'multer';
import path from 'path';
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, uploadDir);
    },

    filename: (req, file, cd) => {
        cd(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cd) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cd(null, true);
    }  else {
        cd(new Error('Only  JPG, PNG, images are allowed'), false);
    }
};

const upload = multer({storage, fileFilter})

export default upload;