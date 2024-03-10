import { Options, Sequelize } from "sequelize"
import { createModels } from "../database/models/index";
import { DbInterface } from "./typings/DbInterface";
import config from './config/db';
class Database {

   private db: Sequelize = null as any;
   public dbInterface: DbInterface = null as any;

   constructor() {
      this.db = new Sequelize(config as Options);
      this.dbInterface = createModels(this.db);
   }
   syncModels() {
      this.dbInterface.sequelize.sync();
   }
   connect() {
      return this.db.authenticate();
   }

   close() {
      this.db.close();
   }
}

export const db = new Database();