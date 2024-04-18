import {configClassAndSequelize} from "../config/config.db.js";
const { DataTypes} = configClassAndSequelize.sequelize
const ConfigDB = new configClassAndSequelize.configDb // init/create object ConfigDB class then store to variable
const Movie = ConfigDB.sequelizeConnectDB.define(
    'movies' , {
        mid : {
            type : DataTypes.STRING ,
            primaryKey : true
        } ,
        title : {
            type : DataTypes.STRING,
        },
        categories : {
            type : DataTypes.STRING,
        },
        rate : {
            type : DataTypes.FLOAT,
        },
        year : {
            type : DataTypes.STRING,
        }
    }
    ,
    {
        // freeze name table not using *s on name
        freezeTableName: true ,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // If don't want createdAt
        createdAt: false,
        // If don't want updatedAt
        updatedAt: false
    }
)

export default Movie