import express from 'express';
import { GroceryController } from '../controllers/grocery.controller';
import { UserRoleRequired } from '../middlewares/user-role-required';
import { AdminRoleRequired } from '../middlewares/admin-role-required';

const router = express.Router();

router.post('/add', AdminRoleRequired, GroceryController.addGrocery);
router.get('/view', GroceryController.viewGrocery);
router.put('/update/:id', AdminRoleRequired, GroceryController.updateGrocery);
router.delete('/delete/:id', AdminRoleRequired, GroceryController.deleteGrocery);
router.put('/manageInventory/:id', AdminRoleRequired, GroceryController.manageInventory);
router.post('/placeOrder', UserRoleRequired, GroceryController.placeOrder);

export default router;