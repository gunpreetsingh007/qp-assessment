import { Sequelize } from 'sequelize';
import { UserInstance } from '../../models/user';
import { CustomModel } from '../Sequelize';
import { GroceryItemInstance } from '../../models/groceryItem';
import { OrderInstance } from '../../models/order';
import { OrderItemInstance } from '../../models/orderItem';

export interface DbInterface {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  models: {
    User: CustomModel<UserInstance>;
    GroceryItem: CustomModel<GroceryItemInstance>;
    Order: CustomModel<OrderInstance>;
    OrderItem: CustomModel<OrderItemInstance>;
  }
};

export type AllDBModels = DbInterface['models'];