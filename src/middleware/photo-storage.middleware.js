import multer from 'multer';
import { PHOTO_DIR } from '../common/constants.js';

const upload = multer({ dest: PHOTO_DIR });

/**
 * Middleware that stores a photo from the request.
 * @type {import('express').RequestHandler}
 */
export const storePhoto = upload.single('image');

/**
 * Middleware that stores a photo from the request.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function in the
 * stack.
 * @return {void}
 */
export function getPhotoUrl(req, res, next) {
    if (req.file) {
        req.body.imageUrl = `/photo/${req.file.originalname}`;
    }
    next();
}
