import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/Sequelize";

export interface GroceryItemAttributes {
    id?: string;
    name: string;
    price: number;
    inventoryCount: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}

export interface GroceryItemInstance extends Model<GroceryItemAttributes>, GroceryItemAttributes{ };

export const GroceryItemFactory = (sequelize: Sequelize) => {
    const attributes = {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4 
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        inventoryCount: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
    };

    const GroceryItem: CustomModel<GroceryItemInstance> = sequelize.define<GroceryItemInstance, GroceryItemAttributes>('GroceryItem', attributes);

    return GroceryItem;
}