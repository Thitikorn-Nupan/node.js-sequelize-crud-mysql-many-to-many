import {configClassAndSequelize} from "../config/config.db.js";
const { DataTypes} = configClassAndSequelize.sequelize
const ConfigDB = new configClassAndSequelize.configDb // init/create object ConfigDB class then store to variable
const Actor = ConfigDB.sequelizeConnectDB.define(
    'actors' , {
        aid : {
            type : DataTypes.STRING ,
            primaryKey : true
        } ,
        fullname : {
            type : DataTypes.STRING,
        },
        born : {
            type : DataTypes.STRING,
        },
        contact : {
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

export default Actor