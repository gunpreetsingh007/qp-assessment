import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/Sequelize";

export interface OrderItemAttributes {
    id?: string;
    orderId: string;
    groceryItemId: string;
    quantity: number;
    priceAtTheTimeOfOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItemInstance extends Model<OrderItemAttributes>, OrderItemAttributes{ };

export const OrderItemFactory = (sequelize: Sequelize) => {
    const attributes = {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4 
        },
        orderId: {
          type: DataTypes.UUID,
          references: {
            model: 'Orders',
            key: 'id'
          },
          allowNull: false
        },
        groceryItemId: {
          type: DataTypes.UUID,
          references: {
            model: 'GroceryItems',
            key: 'id'
          },
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        priceAtTheTimeOfOrder: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        }
    };

    const OrderItem: CustomModel<OrderItemInstance> = sequelize.define<OrderItemInstance, OrderItemAttributes>('OrderItem', attributes);

    OrderItem.associate = models => { 
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
        OrderItem.belongsTo(models.GroceryItem, { foreignKey: 'groceryItemId' });
    }

    return OrderItem;
}