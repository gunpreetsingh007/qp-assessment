import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { db } from './database/connection';
import { LogRoutes } from './middlewares/route-logger';
import { CurrentUser } from './middlewares/current-user';
import userRouter from './routes/user.route';
import groceryRouter from './routes/grocery.route';
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import { log } from './classes/log.class';
const port = 8000;

const init = async () => {
    const app = express();
    app.use(express.json());
    app.use(LogRoutes);
    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).send({ 'message': 'ok' });
    });

    app.use(userRouter)
    app.use(CurrentUser)
    app.use('/grocery',groceryRouter)
    app.all('*', (req: express.Request, res: express.Response) => {
        res.status(404).send({ 'error': 'unknown path for services.' });
    });

    app.listen(port, () => {
        log.info(`Listening on port ${port}`);
    });
}

db.connect().then(() => {
    log.info('db connected');
    runMigrationsBeforeStartingServer().then(() => {
        log.info('migrations ran successfully');
        init();
    }).catch((err: Object) => {
        log.error("Error running migrations: ", err);
    });
}).catch((err: Object) => {
    log.error("Error connecting database: ", err);
});

const runMigrationsBeforeStartingServer = () => {
    const sequelize = db.dbInterface.sequelize;
    const umzug = new Umzug({
      migrations: {
        glob: 'src/database/migrations/*.js',
        resolve: ({ name, path, context }) => {
          const migration = require(path || '')
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          }
        }
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });
    return umzug.up();
}