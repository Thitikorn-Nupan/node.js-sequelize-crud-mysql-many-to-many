import Actor from "../entities/actor.js";
import Movie from "../entities/movie.js";
import Logging from "../log/logging.js";
import {configClassAndSequelize} from "../config/config.db.js";

// don't forget async&await before query by Sequelize
// we have to get sequelize connect db for Writing Row sql
const configDb = new configClassAndSequelize.configDb
const sequelizeConnect = configDb.sequelizeConnectDB

/*
   *****
   Sequelize provides four types of associations (belongsToMany , hasMany , ...)
   A.hasOne(B); // A HasOne B
   A.belongsTo(B); // A BelongsTo B
   A.hasMany(B); // A HasMany B
   A.belongsToMany(B, { through: 'C' }); // A BelongsToMany B through the junction table C
   *****
   If you are done to set up association
   So , you have to no need to set up it again (talk about this Actor , Movie)
*/
// ** Way to work with relation table
// belongsToMany() provides simple way to define the Sequelize Many-to-Many relationship. ** belong (v. อยู่ใน)
Actor.belongsToMany(Movie, {
    through: "actors_movies", // ** through (adv. ผ่าน) ** specify name relation table
    as: "movies", // mapped to table
    foreignKey: "aid", // specify fk
});
Movie.belongsToMany(Actor, {
    through: "actors_movies",
    as: "actors",
    foreignKey: "mid",
});


class ActorServiceCrud {
    retrieveAllActors = async () => { /* reads direct left join */
        return await Actor.findAll({
            include: [
                {
                    model: Movie,
                    as: "movies",
                    attributes: {exclude: ['mid']},
                    // not clear but it works for removing association table (actors_movies)
                    through: {
                        attributes: [],
                    }
                },
            ]
        })
    }
    /*
    ** without through: {attributes: [],}
    [
      {
        "aid": "A001",
        "fullname": "Ella Purnell",
        "born": "1996-09-17",
        "contact": "0663232321",
        "movies": [
          {
            "title": "Fallout",
            "categories": "Action,Adventure,Drama",
            "rate": "8.7",
            "year": "2024-04-11",
            "actors_movies": {
              "aid": "A001",
              "mid": "M001"
            }
          },
          {
            "title": "Kick-Ass 2",
            "categories": "Action,Comedy,Crime",
            "rate": "6.5",
            "year": "2018-01-18",
            "actors_movies": {
              "aid": "A001",
              "mid": "M002"
            }
          }
        ]
      },
      {
        "aid": "A002",
        "fullname": "Aaron Moten",
        "born": "1989-02-28",
        "contact": "0163235329",
        "movies": [
          {
            "title": "Fallout",
            "categories": "Action,Adventure,Drama",
            "rate": "8.7",
            "year": "2024-04-11",
            "actors_movies": {
              "aid": "A002",
              "mid": "M001"
            }
          }
        ]
      },
      {
        "aid": "A003",
        "fullname": "Aaron Taylor-Johnson",
        "born": "1990-06-13",
        "contact": "0196235329",
        "movies": [
          {
            "title": "Kick-Ass 2",
            "categories": "Action,Comedy,Crime",
            "rate": "6.5",
            "year": "2018-01-18",
            "actors_movies": {
              "aid": "A003",
              "mid": "M002"
            }
          },
          {
            "title": "Nocturnal Animals",
            "categories": "Drama,Thriller",
            "rate": "7.5",
            "year": "2016-12-15",
            "actors_movies": {
              "aid": "A003",
              "mid": "M003"
            }
          }
        ]
      }
    ]
    * */


    retrieveActor = async (aid) => {
        return await Actor.findByPk(aid, {
            include: [
                {
                    model: Movie,
                    as: "movies",
                    attributes: {exclude: ['mid']},
                    // not clear but it works for removing association table (actors_movies)
                    through: {
                        attributes: [],
                    }
                },
            ]
        })
    }
    /*
     SELECT `actors`.`aid`, `actors`.`fullname`, `actors`.`born`, `actors`.`contact`, `movies`.`mid` AS `movies.mid`, `movies`.`title` AS `movies.title`, `movies`.`categories` AS `movies.categories`, `movies`.`rate` AS `movies.rate`, `movies`.`year` AS `movies.year` FROM `actors` AS `actors` LEFT OUTER JOIN ( `actors_movies` AS `movies->actors_movies` INNER JOIN `movies` AS `movies` ON `movies`.`mid` = `movies->actors_movies`.`mid`) ON `actors`.`aid` = `movies->actors_movies`.`aid` WHERE `actors`.`aid` = 'A001';
    */


    addActor = async (actor) => {
        /*
        -- aid VARCHAR(4) ,
        -- fullname VARCHAR(25),
        -- born date,
        -- contact VARCHAR(10)
        */
        return await Actor.create({
            aid: actor.aid,
            fullname: actor.fullname,
            born: actor.born,
            contact: actor.contact
        })
    }


    // Way to update association table (actors_movies)
    addRelation = async (aid, mid) => {
        return await this.retrieveActor(aid).then(async (actor) => {
            return await Movie.findByPk(mid).then(async (movie) => {
                // *** try to understand
                // ***
                return await movie.addActor(actor).then((response) => {
                    /*
                    // Logging.winston.info(JSON.stringify(response)) // [{"mid":"M001","aid":"A004"}]
                    Executing (default): SELECT `actors`.`aid`, `actors`.`fullname`, `actors`.`born`, `actors`.`contact`, `movies`.`mid` AS `movies.mid`, `movies`.`title` AS `movies.title`, `movies`.`categories` AS `movies.categories`, `movies`.`rate` AS `movies.rate`, `movies`.`year` AS `movies.year` FROM `actors` AS `actors` LEFT OUTER JOIN ( `actors_movies` AS `movies->actors_movies` INNER JOIN `movies` AS `movies` ON `movies`.`mid` = `movies->actors_movies`.`mid`) ON `actors`.`aid` = `movies->actors_movies`.`aid` WHERE `actors`.`aid` = 'A004';
                    Executing (default): SELECT `mid`, `title`, `categories`, `rate`, `year` FROM `movies` AS `movies` WHERE `movies`.`mid` = 'M001';
                    Executing (default): SELECT `mid`, `aid` FROM `actors_movies` AS `actors_movies` WHERE `actors_movies`.`mid` = 'M001' AND `actors_movies`.`aid` IN ('A004');
                    // then update relation table
                    Executing (default): INSERT INTO `actors_movies` (`mid`,`aid`) VALUES ('M001','A004');
                    */
                    return true
                }) // addActor
            }) // findByPf
        }) // retrieveActor
    }


    removeActor = async (aid) => {
        return await Actor.findByPk(aid).then(async (actor) => { // first find actor
            // Logging.winston.info(JSON.stringify(actor))
            /*
            i have to remove relation first then remove entity
            because it(relation table) has a foreign key
            */
            return await sequelizeConnect.query('delete from actors_movies where aid = :aid', { // second remove relation in aid at all
                replacements: {aid: actor.aid},
                type: configClassAndSequelize.sequelize.QueryTypes.DELETE
            }).then(async () => { // third delete actor
                return await Actor.destroy({
                    where: {aid: actor.aid} // make sure, it exists
                }).then(() => { // done then return true
                    return true
                })
            })
        })
    }
    /*
    Executing (default): SELECT `aid`, `fullname`, `born`, `contact` FROM `actors` AS `actors` WHERE `actors`.`aid` = 'A004';
    Executing (default): delete from actors_movies where aid = 'A004'
    Executing (default): DELETE FROM `actors` WHERE `aid` = 'A004'
    */


    editActor = async (aid, actor) => {
        return await this.retrieveActor(aid).then(async () => {
            // way to use update({values},{where})
            return await Actor.update({
                fullname: actor.fullname,
                born: actor.born,
                contact: actor.contact
            }, {
                where: {aid: aid}
            }).then(() => {
                return true
            })
        }) // retrieveActor
    }
    /*
    Executing (default): SELECT `actors`.`aid`, `actors`.`fullname`, `actors`.`born`, `actors`.`contact`, `movies`.`mid` AS `movies.mid`, `movies`.`title` AS `movies.title`, `movies`.`categories` AS `movies.categories`, `movies`.`rate` AS `movies.rate`, `movies`.`year` AS `movies.year` FROM `actors` AS `actors` LEFT OUTER JOIN ( `actors_movies` AS `movies->actors_movies` INNER JOIN `movies` AS `movies` ON `movies`.`mid` = `movies->actors_movies`.`mid`) ON `actors`.`aid` = `movies->actors_movies`.`aid` WHERE `actors`.`aid` = 'A001';
    Executing (default): UPDATE `actors` SET `fullname`=?,`born`=?,`contact`=? WHERE `aid` = ?
    */


}


/* // testing logic
// console.log(await new ActorServiceCrud().removeActor('A004'))
await new ActorServiceCrud().retrieveActor('A004').then(async (actor) => {
    await Movie.findByPk('M001').then(async (movie) => {
        await movie.addActor(actor).then(()=>{
            console.log(`>> added Actor id=${actor.aid} to Movie id=${movie.mid}`);
        })
    })
})
// first search
Executing (default): SELECT `actors`.`aid`, `actors`.`fullname`, `actors`.`born`, `actors`.`contact`, `movies`.`mid` AS `movies.mid`, `movies`.`title` AS `movies.title`, `movies`.`categories` AS `movies.categories`, `movies`.`rate` AS `movies.rate`, `movies`.`year` AS `movies.year` FROM `actors` AS `actors` LEFT OUTER JOIN ( `actors_movies` AS `movies->actors_movies` INNER JOIN `movies` AS `movies` ON `movies`.`mid` = `movies->actors_movies`.`mid`) ON `actors`.`aid` = `movies->actors_movies`.`aid` WHERE `actors`.`aid` = 'A004';
Executing (default): SELECT `mid`, `title`, `categories`, `rate`, `year` FROM `movies` AS `movies` WHERE `movies`.`mid` = 'M001';
Executing (default): SELECT `mid`, `aid` FROM `actors_movies` AS `actors_movies` WHERE `actors_movies`.`mid` = 'M001' AND `actors_movies`.`aid` IN ('A004');
// then update relation table
Executing (default): INSERT INTO `actors_movies` (`mid`,`aid`) VALUES ('M001','A004');
*/
export default ActorServiceCrud