import express from 'express';
import { db } from '../database/connection';
import { OrderItemAttributes } from '../database/models/orderItem';

export class GroceryController {

    static addGrocery = async (req: express.Request, res: express.Response) => {
        try {
            const { name, price, inventoryCount } = req.body;
            await db.dbInterface.models.GroceryItem.create({ name, price, inventoryCount });
            return res.status(200).send({ message: 'Grocery added successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Error adding grocery' });
        }
    }

    static viewGrocery = async (req: express.Request, res: express.Response) => {
        try {
            const groceries = await db.dbInterface.models.GroceryItem.findAll({ where: { isDeleted: false }, attributes: { exclude: ['isDeleted'] } });
            return res.status(200).send(groceries);
        } catch (error) {
            return res.status(500).send({ message: 'Error viewing groceries' });
        }
    }

    static updateGrocery = async (req: express.Request, res: express.Response) => {
        try {
            const { name, price } = req.body;
            await db.dbInterface.models.GroceryItem.update({ name, price }, { where: { id: req.params.id, isDeleted: false } });
            return res.status(200).send({ message: 'Grocery updated successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Error updating grocery' });
        }
    }

    static deleteGrocery = async (req: express.Request, res: express.Response) => {
        try {
            await db.dbInterface.models.GroceryItem.update({ isDeleted: true }, { where: { id: req.params.id } }); // Doing the soft delete so that the grocery item can be referenced by the OrdersItem Table if any order is placed with this grocery item
            return res.status(200).send({ message: 'Grocery item deleted successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Error deleting grocery' });
        }
    }

    static manageInventory = async (req: express.Request, res: express.Response) => {
        try {
            const { inventoryCount } = req.body;
            await db.dbInterface.models.GroceryItem.update( { inventoryCount }, { where: { id: req.params.id, isDeleted: false } });
            return res.status(200).send( { message: 'Inventory updated successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Error while updating inventory' });
        }
    }

    static placeOrder = async (req: express.Request, res: express.Response) => {
        const transaction = await db.dbInterface.sequelize.transaction();
        try {
            const groceryItemsArray: Array<{ id: string, quantity: number, priceAtTheTimeOfOrder?: number}> = req.body;
            let totalPrice = 0;
            const groceryItemIds = groceryItemsArray.map(item => item.id);
            const groceryItemsInDb = await db.dbInterface.models.GroceryItem.findAll({ where: { id: groceryItemIds, isDeleted: false } });
            const groceryItemsMap = new Map(groceryItemsInDb.map(item => [item.id, item]));
            for(let i=0; i<groceryItemsArray.length; i++){
                const groceryItemPayload = groceryItemsArray[i];
                const groceryItemInDb = groceryItemsMap.get(groceryItemPayload.id);
                if (!groceryItemInDb || groceryItemInDb.inventoryCount < groceryItemPayload.quantity) {
                    throw new Error('Grocery Item not available');
                }
                totalPrice += groceryItemInDb.price * groceryItemPayload.quantity;
                groceryItemPayload.priceAtTheTimeOfOrder = groceryItemInDb.price;
                await db.dbInterface.models.GroceryItem.update({ inventoryCount: groceryItemInDb.inventoryCount - groceryItemPayload.quantity }, { where: { id: groceryItemPayload.id }, transaction });
            }
            const orderCreated = await db.dbInterface.models.Order.create({ userId: req.currentUser.id, totalPrice, status: "pending" }, { transaction, returning: true});
            const orderId: string = orderCreated.id!;
            const orderItems = groceryItemsArray.map((item) => { 
                return { orderId, groceryItemId: item.id, quantity: item.quantity, priceAtTheTimeOfOrder: item.priceAtTheTimeOfOrder! } 
            });
            await db.dbInterface.models.OrderItem.bulkCreate(orderItems, { transaction });
            await transaction.commit();
            return res.status(200).send({ message: 'Order placed successfully' });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).send({ message: 'Error placing order' });
        }
    }
}