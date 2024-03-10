"use strict";
require('dotenv').config();
module.exports = { 
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": Number(process.env.DB_PORT),
    "dialect": process.env.DB_DIALECT || "postgres",
    "logging": false,
    "pool": {
        max: Number(process.env.MAX_POOL_SIZE) || 80,
        min: Number(process.env.MIN_POOL_SIZE) || 0,
        idle: Number(process.env.POOL_IDLE) || 30000,
        acquire: Number(process.env.POOL_ACQUIRE) || 30000,
    }
}
  
