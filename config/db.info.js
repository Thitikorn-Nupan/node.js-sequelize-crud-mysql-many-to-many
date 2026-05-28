import path from "path";
import dotenv from 'dotenv'
// dotenv.config({ path : path.resolve('../env/.env') , debug: true }) // for testing actor.routers.js
dotenv.config({ path : path.resolve('../node-js-crud-mysql-many-to-many/env/.env') , debug: true }) // for testing runner.js
export const info = {
    database : process.env.MYSQLL_DATABASE,
    username : process.env.MYSQLL_USERNAME,
    password : process.env.MYSQLL_PASSWORD,
    host : process.env.MYSQLL_HOST,
    port : process.env.MYSQLL_PORT
}