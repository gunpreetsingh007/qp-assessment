import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/Sequelize";

export interface OrderAttributes {
    id?: string;
    userId: string;
    totalPrice: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderInstance extends Model<OrderAttributes>, OrderAttributes{ };

export const OrderFactory = (sequelize: Sequelize) => {
    const attributes = {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4 
        },
        userId: {
          type: DataTypes.UUID,
          references: {
            model: 'Users',
            key: 'id'
          },
          allowNull: false
        },
        totalPrice: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
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

    const Order: CustomModel<OrderInstance> = sequelize.define<OrderInstance, OrderAttributes>('Order', attributes);

    Order.associate = models => { 
        Order.belongsTo(models.User, { foreignKey: 'userId' });
    }

    return Order;
}