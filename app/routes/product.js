import express from 'express';
import * as productController from '../controllers/product.js';
import auth from '../middleware/auth.js';
import { checkOwnership } from '../middleware/checkOwnership.js';
import { validateProduct } from '../middleware/validateProduct.js';

const router = express.Router();

router.use(auth);

router.get('/', productController.getAll);
router.post('/', validateProduct, productController.create);
router.put('/:id', validateProduct, checkOwnership, productController.update);
router.delete('/:id', checkOwnership, productController.remove);

export default router;