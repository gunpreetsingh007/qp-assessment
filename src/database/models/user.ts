import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/Sequelize";

export interface UserAttributes {
    id?: string;
    username: string;
    password: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes{ };

export const UserFactory = (sequelize: Sequelize) => {
    const attributes = {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4 
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        role: {
          type: DataTypes.STRING,
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
    }

    const User: CustomModel<UserInstance> = sequelize.define<UserInstance, UserAttributes>('User', attributes);

    return User;
}