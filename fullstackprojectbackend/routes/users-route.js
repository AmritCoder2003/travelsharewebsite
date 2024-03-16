import express from 'express';
import { check } from 'express-validator';
import { getUsers, signup ,login } from '../controllers/users-controllers.js';

const router = express.Router();
import fileupload from '../middleware/file-upload.js';
router.get('/',getUsers );

router.post('/signup',fileupload.single('image'),[check('name').not().isEmpty(),
                   check('email').normalizeEmail()
                   .isEmail(), //Test@test.com  ---> test@test.com
                    check('password').isLength({min:6})
                 ],signup );

router.post('/login',[check('email').normalizeEmail()
                    .isEmail(), //Test@test.com  ---> test@test.com 
                    check('password').isLength({min:6})],login );

export default router;