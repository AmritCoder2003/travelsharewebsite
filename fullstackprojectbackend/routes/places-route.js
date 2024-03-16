import express from 'express';
//import { getPlaceById, getPlacesByUserId } from '../controllers/places-controllers.js';
import { check } from 'express-validator';
import { getPlaceById, getPlacesByUserId,createPlace, updatePlace,deletePlace} from '../controllers/places-controllers.js';
import fileupload from "../middleware/file-upload.js";
const router = express.Router();

router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlacesByUserId);

router.post('/',fileupload.single('image'),[check('title').not().isEmpty(),
                check('description').isLength({min:5}),
                check('address').not().isEmpty()],createPlace);

router.patch('/:pid',[check('title').not().isEmpty(),
                check('description').isLength({min:5}),

],updatePlace);

router.delete('/:pid',deletePlace);

export default router;