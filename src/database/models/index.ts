import { Sequelize } from 'sequelize';
import { DbInterface } from '../typings/DbInterface';
import { UserFactory } from './user';
import { GroceryItemFactory } from './groceryItem';
import { OrderFactory } from './order';
import { OrderItemFactory } from './orderItem';

export const createModels = (sequelize: Sequelize): DbInterface => {

  const db: DbInterface = {
    sequelize,
    Sequelize: Sequelize,
    models: {
      User: UserFactory(sequelize),
      GroceryItem: GroceryItemFactory(sequelize),
      Order: OrderFactory(sequelize),
      OrderItem: OrderItemFactory(sequelize)
    }
  };

  for (let model in db.models) {
    let m = (db.models)[model as keyof typeof db.models]
    if (m.associate) {
      m.associate(db.models);
    }
  }

  return db;
};